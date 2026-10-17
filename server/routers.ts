import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { systemRouter } from "./_core/systemRouter.js";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./_core/trpc.js";

import {
  archiveProduct,
  createStoreForUser,
  deleteAdminUser,
  deleteStore,
  countActiveStoreProducts,
  getAdminUsers,
  getPublicStoreBySlug,
  getStoreDashboardSummary,
  getStoreBrandingUrls,
  getStoreWithUsage,
  getStoresForUser,
  getProduct,
  insertProduct,
  insertStoreCategory,
  listProducts,
  listStoreCategories,
  listStoreMarketFeatureKeys,
  renameStoreCategory,
  updateProduct,
  listPublicProducts,
  purchaseMarketFeature,
  updateStoreBranding,
  updateStoreBannerSettings,
  updateStoreProductCardModel,
  updateStoreNavButtonModel,
  updateStoreSectionModel,
  updateStoreStatus,
  updateStoreLocale,
  saveStoreCustomDomain,
  markStoreCustomDomainVerified,
  getPublicStoreByCustomDomain,
  getStoreCustomDomainSettings,
  updateStoreTheme,
  updateStoreWhatsApp,
  userHasStoreAccess,
  listMarketFeatures,
  listActiveMarketFeatures,
  insertMarketFeature,
  updateMarketFeature,
  ensureMarketFeaturesSeeded,
  setStoreCreditMzn,
  addStoreCreditMzn,
  getStoreStockCapacity,
  ensureStoreCode,
  getStoreCodeRedemption,
  useStorePromoCode,
  STORE_CODE_OWNER_REWARD,
  STORE_CODE_USER_REWARD,
} from "./db.js";

import type { InsertProduct } from "../drizzle/schema.js";

import {
  MARKET_CATEGORIES,
  findMarketCatalogEntry,
  getMarketModelNumbers,
} from "../shared/market-catalog.js";

import type { MarketCatalogCategory } from "../shared/market-catalog.js";

import { fromNodeHeaders } from "better-auth/node";
import { randomBytes } from "node:crypto";
import {
  normalizeCustomDomain,
  checkCustomDomainVerification,
} from "./custom-domain.js";

import { auth, activeSocialProviders, getBetterAuthUserById } from "./auth.js";

import {
  createStoreDownloadUrl,
  createStoreUploadUrl,
  extractStoreObjectKey,
  isPresignedObjectUrl,
} from "./r2.js";

/* ============================================================
   INPUTS
   ============================================================ */

const storeIdInput = z.string().trim().min(3).max(64);

const storeSlugInput = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "O endereço da loja contém caracteres inválidos."
  );

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const whatsappInput = z
  .string()
  .trim()
  .min(7)
  .max(40)
  .refine(value => {
    if (!/^\+?[\d\s().-]+$/.test(value)) {
      return false;
    }

    const digits = value.replace(/\D/g, "");

    return digits.length >= 7 && digits.length <= 15;
  }, "Introduza um número de WhatsApp válido.");

const brandingKeyInput = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .regex(
    /^stores\/[a-zA-Z0-9_-]+\/branding\/[a-zA-Z0-9._-]+$/,
    "Chave de ficheiro inválida."
  );

/*
 * Chaves R2 de branding: stores/{storeId}/branding/ficheiro.ext
 * Validadas no formato e revalidadas contra a loja na mutation.
 */
const themeInput = z.literal("nova");

/*
 * Localização da loja (Configurações → Idioma e moeda).
 *
 * language e currency são gravados JUNTOS pela mesma
 * mutation: a moeda formata os preços da loja e o idioma
 * escolhe o catálogo de textos do storefront público
 * (client/src/lib/i18n).
 *
 * São enums — e não texto livre — para que a base de dados
 * nunca fique com uma localização que a loja não sabe
 * renderizar. Valores antigos fora desta lista são
 * normalizados no cliente ("pt"/"MZN").
 */
const storeLanguageInput = z.enum(["pt", "en"]);

const storeCurrencyInput = z.enum(["MZN", "ZAR", "USD"]);

/* ============================================================
   HELPERS
   ============================================================ */

function requireStoreAccess(hasAccess: boolean) {
  if (!hasAccess) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Não tem acesso a esta loja.",
    });
  }
}

/*
 * Domínio de modelos aceites por categoria, DERIVADO do
 * catálogo estrutural (shared/market-catalog.ts) — fonte
 * única de verdade partilhada com o Market e com o tema.
 *
 * Garante que todos os modelos vendidos no Market são
 * aceites pela Personalizar Loja (antes o backend limitava
 * header/footer/seções a 1–3 e a navegação a 1–5, deixando
 * modelos comprados sem forma de serem aplicados).
 */
function marketModelEnum(
  category: MarketCatalogCategory,
) {
  const models = getMarketModelNumbers(category);

  if (models.length === 0) {
    throw new Error(
      `MARKET_MODEL_DOMAIN_EMPTY: categoria "${category}" sem modelos no catálogo.`
    );
  }

  return z.enum(models as [string, ...string[]]).nullable();
}

/* ============================================================
   PRODUTOS — CONTRATOS DE ENTRADA

   Schemas exportados para serem validados diretamente nos
   testes (sem base de dados). O router usa exatamente estes
   contratos — a fonte de verdade é única.
   ============================================================ */

export const PRODUCT_VARIANTS_MAX = 200;

/**
 * Uma variante = uma combinação concreta de valores das
 * opções do produto, com preço/stock/SKU próprios.
 * Opcional: campo vazio/null herda o valor do produto.
 */
export const productVariantInput = z.object({
  /* Mesmos nomes de opção de `options` (Record<opção, valor>). */
  values: z
    .record(
      z.string().min(1).max(80),
      z.string().min(1).max(120),
    )
    .refine(values => Object.keys(values).length > 0, {
      message: "A variante precisa de pelo menos um valor de opção.",
    }),

  priceMzn: z.number().int().nonnegative().nullable().optional(),

  stock: z.number().int().nonnegative().nullable().optional(),

  sku: z.string().trim().max(80).nullable().optional(),
});

export type ProductVariantInput = z.infer<typeof productVariantInput>;

/**
 * As variantes só fazem sentido relativamente às opções do
 * produto: cada linha tem de descrever uma combinação VÁLIDA
 * de valores. Combinações órfãs (opção removida/renomeada ou
 * valor alterado) são descartadas no servidor — a base de
 * dados é a fonte de verdade do alinhamento.
 */
export function alignProductVariants(
  options: { name: string; values: string[] }[],
  variants: ProductVariantInput[],
): ProductVariantInput[] {
  const allowed = new Map<string, Set<string>>(
    options
      .map(option => ({
        name: option.name.trim(),
        values: option.values
          .map(value => value.trim())
          .filter(Boolean),
      }))
      .filter(option => option.name && option.values.length > 0)
      .map(option => [option.name, new Set(option.values)]),
  );

  return variants.filter(variant => {
    const entries = Object.entries(variant.values);

    /* Tem de cobrir exatamente todas as opções do produto. */
    if (entries.length !== allowed.size) {
      return false;
    }

    return entries.every(([name, value]) =>
      allowed.get(name.trim())?.has(value.trim()),
    );
  });
}

export const productCreateInput = z.object({
  storeId: storeIdInput,

  name: z.string().trim().min(2).max(180),

  slug: z.string().trim().min(2).max(180),

  description: z.string().max(5000).optional(),

  priceMzn: z.number().int().nonnegative(),

  compareAtPriceMzn: z.number().int().nonnegative().optional(),

  stock: z.number().int().nonnegative().default(0),

  /*
   * Categoria do produto: deve ser uma das categorias
   * reais da loja. Vazio/null = Sem categoria.
   */
  category: z.string().trim().max(80).optional(),

  imageUrl: z.string().url().optional(),

  imageKeys: z
    .array(z.string().trim().min(1).max(1024))
    .max(12)
    .default([]),

  options: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),

        values: z
          .array(z.string().trim().min(1).max(120))
          .min(1)
          .max(100),
      })
    )
    .max(10)
    .default([]),

  /*
   * Preço/stock/SKU por combinação de opções. Por omissão,
   * nenhuma variante define valores próprios.
   */
  variants: z.array(productVariantInput).max(PRODUCT_VARIANTS_MAX).default([]),

  /*
   * Estado de publicação escolhido no formulário:
   * "draft" = rascunho (não aparece na storefront);
   * "active" = publicado imediatamente.
   */
  status: z.enum(["draft", "active"]).default("draft"),

  /* Produto em destaque (Visibilidade). */
  featured: z.boolean().default(false),
});

export const productUpdateInput = z.object({
  storeId: storeIdInput,

  productId: z.number().int().positive(),

  name: z.string().trim().min(2).max(180).optional(),

  description: z.string().trim().max(5000).nullable().optional(),

  priceMzn: z.number().int().positive().optional(),

  compareAtPriceMzn: z.number().int().positive().nullable().optional(),

  stock: z.number().int().nonnegative().optional(),

  category: z.string().trim().max(80).nullable().optional(),

  imageUrl: z.string().url().nullable().optional(),

  imageKeys: z
    .array(z.string().trim().min(1).max(1024))
    .max(12)
    .optional(),

  options: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(80),
        values: z
          .array(z.string().trim().min(1).max(120))
          .min(1)
          .max(100),
      })
    )
    .max(10)
    .optional(),

  /*
   * Preço/stock/SKU por combinação de opções (parcial tal
   * como os restantes campos da edição).
   */
  variants: z.array(productVariantInput).max(PRODUCT_VARIANTS_MAX).optional(),

  /*
   * Estado de publicação: permite publicar ("active"),
   * voltar a rascunho ("draft") ou arquivar
   * ("archived") a partir do modal de edição.
   */
  status: z.enum(["draft", "active", "archived"]).optional(),

  /* Produto em destaque (Visibilidade). */
  featured: z.boolean().optional(),
});

/* ============================================================
   APP ROUTER
   ============================================================ */

export const appRouter = router({
  system: systemRouter,

  /* ==========================================================
     MARKET
     Funcionalidades de personalização vendidas no Market.
     Os preços e conteúdos vêm SEMPRE da base de dados —
     nunca de constantes no cliente.
     ========================================================== */

  market: router({
    /**
     * Funcionalidades Market ativas, para consumo no
     * Market (público). Garante o seed estrutural antes
     * de devolver a lista.
     */
    features: publicProcedure.query(async () => {
      await ensureMarketFeaturesSeeded();

      return listActiveMarketFeatures();
    }),

    /* ========================================================
       PURCHASES (compras/desbloqueios por loja)
       O desbloqueio vive na base de dados
       (store_market_features) — permanente, por loja.
       ======================================================== */

    purchases: router({
      /**
       * FeatureKeys comprados/desbloqueados pela loja.
       * Apenas membros da loja — o desbloqueio é
       * privado da loja.
       */
      mine: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .query(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const featureKeys = await listStoreMarketFeatureKeys({
            storeId: input.storeId,
          });

          return { featureKeys };
        }),

      /**
       * Compra de uma funcionalidade do Market com o
       * crédito da loja (stores.creditMzn). O
       * desbloqueio fica guardado permanentemente em
       * store_market_features.
       */
      buy: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            featureKey: z.string().trim().min(1).max(64),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const result = await purchaseMarketFeature({
            storeId: input.storeId,
            featureKey: input.featureKey,
          });

          if (result.ok) {
            return result;
          }

          switch (result.reason) {
            case "ALREADY_OWNED":
              throw new TRPCError({
                code: "CONFLICT",
                message: "Esta funcionalidade já foi comprada pela loja.",
              });
            case "INSUFFICIENT_CREDIT":
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Crédito insuficiente. Pede mais crédito ao administrador.",
              });
            case "FEATURE_NOT_FOUND":
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Funcionalidade Market não encontrada ou inativa.",
              });
            default:
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Loja não encontrada.",
              });
          }
        }),
    }),
  }),

  /* ==========================================================
     AUTH
     ========================================================== */

  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),

    /*
     * Providers sociais ativos (Google/Apple), derivados das
     * variáveis de ambiente no arranque. O frontend usa esta
     * lista para mostrar/esconder os botões "Continuar com
     * Google" e "Continuar com Apple". Leitura apenas —
     * não expõe credenciais, só disponibilidade.
     */
    socialProviders: publicProcedure.query(() => activeSocialProviders),

    /*
     * Repõe a credencial de palavra-passe da sessão atual
     * quando a conta NÃO tem nenhuma.
     *
     * Motivo: o Better Auth 1.7 (revokeUnprovenAccountAccess)
     * apaga todas as contas ligadas — incluindo a credencial
     * "credential" com o hash da palavra-passe — de uma conta
     * não verificada no momento em que o email é verificado
     * via OTP. Sem este passo, quem cria conta e valida o
     * código fica sem palavra-passe (login email+password
     * falha de imediato).
     *
     * Segurança: exige sessão válida e recusa-se a substituir
     * uma palavra-passe existente (PASSWORD_ALREADY_SET), pelo
     * que nunca serve para a trocar.
     */
    restorePassword: protectedProcedure
      .input(
        z.object({
          newPassword: z.string().min(8).max(128),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          await auth.api.setPassword({
            headers: fromNodeHeaders(ctx.req.headers),
            body: { newPassword: input.newPassword },
          });

          return {
            restored: true,
            alreadyHadPassword: false,
          } as const;
        } catch (error) {
          const message =
            error instanceof Error ? error.message.toLowerCase() : "";

          /*
           * A conta já tem palavra-passe: nada a repor.
           * Ocorre no caminho de recuperação de contas
           * já verificadas — a palavra-passe habitual
           * continua válida.
           */
          if (message.includes("already has a password")) {
            return {
              restored: false,
              alreadyHadPassword: true,
            } as const;
          }

          console.error(
            "[Auth] Falha ao repor a palavra-passe após verificação:",
            error
          );

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Não foi possível repor a palavra-passe da conta.",
          });
        }
      }),
  }),

  /* ==========================================================
     STORES
     ========================================================== */

  stores: router({
    mine: protectedProcedure.query(({ ctx }) =>
      getStoresForUser(ctx.user.id, ctx.user.role === "admin")
    ),

    bySlug: publicProcedure
      .input(
        z.object({
          slug: storeSlugInput,
        })
      )
      .query(async ({ input }) => {
        const store = await getPublicStoreBySlug(input.slug);

        if (!store) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loja não encontrada.",
          });
        }

        /*
         * Branding e produtos são independentes:
         * correr em paralelo encurta o TTFB do
         * storefront público (a rota mais crítica).
         */
        const [branding, products] = await Promise.all([
          getStoreBrandingUrls(store),
          listPublicProducts(store.id),
        ]);

        /*
         * Whitelist público (isolamento entre lojas):
         * a resposta pública expõe APENAS os campos que o
         * storefront precisa. Nunca saldos de crédito
         * (creditMzn), comissão (commissionCredit), bônus
         * (bonusCredit), código da loja (storeCode),
         * bannerFeatures internos nem chaves R2 cruas.
         * bannerTexts é público (é conteúdo de exibição
         * do carrossel).
         */
        return {
          store: {
            id: store.id,
            name: store.name,
            slug: store.slug,
            category: store.category,
            currency: store.currency,

            /*
             * Idioma de exibição da loja pública
             * ("pt" | "en"). Lido pelo i18n do storefront
             * para escolher o catálogo de textos.
             */
            language: store.language,

            status: store.status,
            themeKey: store.themeKey,
            whatsapp: store.whatsapp ?? null,
            logoKey: store.logoKey ?? null,
            bannerKey: store.bannerKey ?? null,
            bannerKeys: store.bannerKeys ?? [],
            bannerModel: store.bannerModel ?? null,
            productCardModel: store.productCardModel ?? null,
            navButtonModel: store.navButtonModel ?? null,
            headerModel: store.headerModel ?? null,
            footerModel: store.footerModel ?? null,
            categoryCardModel: store.categoryCardModel ?? null,
            bannerTexts: store.bannerTexts ?? [],

            /*
             * bannerFeatures é conteúdo de exibição do
             * storefront público (estado de publicação,
             * botão/texto/animação por banner) — necessário
             * para o carrossel do tema Nova.
             */
            bannerFeatures: store.bannerFeatures ?? {},
          },
          branding,
          products,
        };
      }),

    /* ========================================================
       BRANDING (logo + banner da loja)
       ======================================================== */

    branding: router({
      /*
       * Configuração atual (chaves R2) — apenas
       * membros da loja.
       */
      get: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .query(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const result = await getStoreWithUsage(input.storeId);

          if (!result) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            logoKey: result.store.logoKey ?? null,
            bannerKey: result.store.bannerKey ?? null,
            bannerKeys: result.store.bannerKeys ?? [],
            productCardModel: result.store.productCardModel ?? null,
            bannerModel: result.store.bannerModel ?? null,
            navButtonModel: result.store.navButtonModel ?? null,
            headerModel: result.store.headerModel ?? null,
            footerModel: result.store.footerModel ?? null,
            categoryCardModel: result.store.categoryCardModel ?? null,
            bannerTexts: result.store.bannerTexts ?? [],
            bannerFeatures: result.store.bannerFeatures ?? {},
            ...(await getStoreBrandingUrls(result.store)),
          };
        }),

      /*
       * Gera URL de upload presigned R2 para o
       * logo ou banner, isolado por loja
       * (stores/{storeId}/branding/...).
       */
      createUploadUrl: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            asset: z.enum(["logo", "banner"]),

            fileName: z.string().trim().min(1).max(255),

            contentType: z.enum([
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/svg+xml",
            ]),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const upload = await createStoreUploadUrl({
            storeId: input.storeId,
            folder: "branding",
            fileName: input.fileName,
            contentType: input.contentType,
          });

          const imageUrl = await createStoreDownloadUrl(upload.key);

          return {
            key: upload.key,
            uploadUrl: upload.uploadUrl,
            imageUrl,
          };
        }) /*
       * Guarda/substitui logo, banner e/ou lista de
       * banners. null remove o asset atual.
       */,
      set: protectedProcedure
        .input(
          z
            .object({
              storeId: storeIdInput,

              logoKey: brandingKeyInput.nullable().optional(),

              bannerKey: brandingKeyInput.nullable().optional(),

              bannerKeys: z
                .array(brandingKeyInput)
                .max(10, "Máximo de 10 banners.")
                .nullable()
                .optional(),
            })
            .refine(
              data =>
                data.logoKey !== undefined ||
                data.bannerKey !== undefined ||
                data.bannerKeys !== undefined,
              {
                message: "Indique o logo, o banner ou ambos.",
              }
            )
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          /*
           * Defesa extra: cada chave tem de
           * pertencer à própria loja
           * (isolamento total entre lojas).
           */
          if (
            input.logoKey &&
            !input.logoKey.startsWith(`stores/${input.storeId}/branding/`)
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Ficheiro não pertence à loja selecionada.",
            });
          }

          if (
            input.bannerKey &&
            !input.bannerKey.startsWith(`stores/${input.storeId}/branding/`)
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Ficheiro não pertence à loja selecionada.",
            });
          }

          /*
           * Defesa extra para a lista: cada chave tem de
           * pertencer à própria loja.
           */
          if (
            input.bannerKeys?.some(
              key => !key.startsWith(`stores/${input.storeId}/branding/`)
            )
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Ficheiro não pertence à loja selecionada.",
            });
          }

          const store = await updateStoreBranding({
            storeId: input.storeId,
            logoKey: input.logoKey,
            bannerKey: input.bannerKey,
            bannerKeys: input.bannerKeys,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            logoKey: store.logoKey ?? null,
            bannerKey: store.bannerKey ?? null,
            bannerKeys: store.bannerKeys ?? [],
          };
        }),

      /* ========================================================
         BANNERS: modelo do carrossel + textos por slide
         (tema Nova). Um único modelo por loja em cada
         momento; os textos são guardados por índice de
         slide e os modelos sem texto simplesmente os
         ignoram.
         ======================================================== */

      setBannerModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            /* Modelos de carrossel do Market (1banner–9banner).
               O 10banner (Simples) não é modelo de carrossel: liga
               o modo de imagem única — ver BANNER_MODELS no tema. */
            model: marketModelEnum("banner"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreBannerSettings({
            storeId: input.storeId,
            bannerModel: input.model,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerModel: store.bannerModel ?? null,
          };
        }),

      setBannerFeatures: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            /*
             * Mapa chave R2 do banner → elementos.
             * Cada chave é validada contra a loja.
             */
            bannerFeatures: z
              .record(
                z.string(),
                z
                  .object({
                    /* Estado de publicação (false = rascunho). */
                    published: z.boolean().optional(),
                    button: z
                      .object({
                        enabled: z.boolean(),
                        label: z.string().max(40).optional(),
                        target: z.enum(["product", "link"]).optional(),
                        destination: z.string().max(600).optional(),
                        position: z
                          .enum([
                            "bottom-left",
                            "bottom-right",
                            "top-left",
                            "top-right",
                            "center",
                          ])
                          .optional(),
                      })
                      .optional(),
                    text: z
                      .object({
                        enabled: z.boolean(),
                        text: z.string().max(200).optional(),
                        position: z
                          .enum([
                            "top-left",
                            "top-center",
                            "bottom-left",
                            "bottom-center",
                            "bottom-right",
                          ])
                          .optional(),
                      })
                      .optional(),
                    animation: z
                      .object({
                        enabled: z.boolean(),
                        type: z
                          .enum([
                            "none",
                            "fade",
                            "zoom",
                            "slide-up",
                            "slide-left",
                          ])
                          .optional(),
                      })
                      .optional(),
                    countdown: z
                      .object({
                        enabled: z.boolean(),
                        endsAt: z.string().max(40).optional(),
                      })
                      .optional(),
                  })
                  .strip()
              )
              .refine(features => Object.keys(features).length <= 20, {
                message: "Máximo de 20 banners com elementos.",
              })
              .nullable(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          /*
           * Isolamento por loja: cada chave tem de
           * apontar para um ficheiro da própria loja.
           */
          const featureKeys = Object.keys(input.bannerFeatures ?? {});

          if (
            featureKeys.some(
              key => !key.startsWith(`stores/${input.storeId}/branding/`)
            )
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "Ficheiro não pertence à loja selecionada.",
            });
          }

          const store = await updateStoreBannerSettings({
            storeId: input.storeId,
            bannerFeatures: input.bannerFeatures ?? {},
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerFeatures: store.bannerFeatures ?? {},
          };
        }),

      setBannerTexts: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            bannerTexts: z
              .array(
                z.object({
                  title: z.string().max(120).optional(),
                  subtitle: z.string().max(200).optional(),
                })
              )
              .max(10)
              .nullable(),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreBannerSettings({
            storeId: input.storeId,
            bannerTexts: input.bannerTexts,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            bannerTexts: store.bannerTexts ?? [],
          };
        }),

      /* ========================================================
         MODELO DOS CARTÕES DE PRODUTO (tema Nova)
         "1".."5" — ver BrandingPage / ProductCard.
         ======================================================== */

      setProductCardModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: marketModelEnum("product_card"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreProductCardModel(
            input.storeId,
            input.model
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            productCardModel: store.productCardModel ?? null,
          };
        }),

      /* ========================================================
         MODELO DOS BOTÕES DE NAVEGAÇÃO (tema Nova)
         "1".."5" — ver BrandingPage / navButtonModels.
         ======================================================== */

      setNavButtonModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: marketModelEnum("nav_button"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreNavButtonModel(
            input.storeId,
            input.model
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            navButtonModel: store.navButtonModel ?? null,
          };
        }),

      /* ========================================================
         MODELOS DOS BANNERS / CARTÕES / HEADER / FOOTER /
         CARTÕES DE CATEGORIA (tema Nova) — um modelo por
         categoria, desbloqueado por compra no Market.
         ======================================================== */

      setHeaderModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: marketModelEnum("header"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreSectionModel(
            input.storeId,
            "headerModel",
            input.model
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            headerModel: store.headerModel ?? null,
          };
        }),

      setFooterModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: marketModelEnum("footer"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreSectionModel(
            input.storeId,
            "footerModel",
            input.model
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            footerModel: store.footerModel ?? null,
          };
        }),

      setCategoryCardModel: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,

            model: marketModelEnum("category_card"),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreSectionModel(
            input.storeId,
            "categoryCardModel",
            input.model
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            categoryCardModel: store.categoryCardModel ?? null,
          };
        }),
    }),

    /* ========================================================
       STORE USAGE (leitura do dashboard)

       A plataforma é 100% gratuita: sem planos,
       mensalidades ou upgrades. Esta leitura existe
       apenas para métricas do dashboard (produtos
       usados) e para o saldo de crédito da loja,
       usado somente no Market.
       ======================================================== */

    usage: router({
      current: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .query(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          /*
           * Uso e capacidade de estoque são independentes
           * (ambos só precisam do storeId): correr em
           * paralelo poupa uma ida e volta ao Neon neste
           * endpoint que aparece no header, sidebar e
           * overview do dashboard.
           */
          const [result, stockCapacity] = await Promise.all([
            getStoreWithUsage(input.storeId),
            getStoreStockCapacity(input.storeId),
          ]);

          if (!result) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          /*
           * Lojas criadas antes da migração 0023 podem ainda
           * não ter código — reparar silenciosamente aqui.
           */
          if (!result.store.storeCode) {
            await ensureStoreCode(result.store.id);
          }

          /*
           * Releitura apenas quando houve reparação, para
           * devolver o código recém-atribuído. Em paralelo,
           * lê se a loja já utilizou um código promocional
           * (o campo de inserir desaparece depois do uso).
           */
          const [store, redemption] = await Promise.all([
            result.store.storeCode
              ? Promise.resolve(result.store)
              : getStoreWithUsage(input.storeId).then(
                  r => r?.store ?? result.store
                ),
            getStoreCodeRedemption(input.storeId),
          ]);

          return {
            ...result,
            store,
            stockCapacity,
            promoCode: redemption
              ? {
                  usedStoreCode: redemption.usedStoreCode,
                  userRewardCredits: redemption.userRewardCredits,
                }
              : null,

            /*
             * Recompensas vigentes do código promocional
             * (o servidor é a única fonte de verdade) —
             * usadas pela área "Minha Conta de Créditos"
             * para explicar quanto a loja ganha ao indicar
             * outras lojas e quanto recebe ao usar o
             * código de outra loja.
             */
            storeCodeRewards: {
              ownerRewardCredits: STORE_CODE_OWNER_REWARD,
              userRewardCredits: STORE_CODE_USER_REWARD,
            },
          };
        }),

      /* ========================================================
         PROMO (código promocional entre lojas)

         Usar o código de outra loja (uma única vez):
           - dono do código:    +6.200 créditos de comissão
             (acumula em commissionCredit e também entra no
             crédito atual creditMzn);
           - loja que usou:     +4.850 créditos.
         ======================================================== */

      usePromoCode: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            code: z.string().trim().min(4).max(32),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const result = await useStorePromoCode({
            storeId: input.storeId,
            rawCode: input.code,
          });

          if (result.ok) {
            return result;
          }

          switch (result.reason) {
            case "CODE_IS_OWN":
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Não podes usar o código da tua própria loja.",
              });
            case "ALREADY_USED":
              throw new TRPCError({
                code: "CONFLICT",
                message: "A tua loja já utilizou um código promocional.",
              });
            case "STORE_NOT_FOUND":
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Loja não encontrada.",
              });
            default:
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Código promocional inválido. Verifica e tenta novamente.",
              });
          }
        }),
    }),

    /* ========================================================
       THEMES
       ======================================================== */

    theme: router({
      set: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            themeKey: themeInput,
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreTheme(input.storeId, input.themeKey);

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store,
          };
        }),
    }),

    /* ========================================================
       CHECKOUT
       ======================================================== */

    checkout: router({
      updateWhatsApp: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            whatsapp: whatsappInput,
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreWhatsApp(
            input.storeId,
            input.whatsapp
          );

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return store;
        }),
    }),

    /* ========================================================
       LOCALIZAÇÃO (idioma + moeda)
       ======================================================== */

    locale: router({
      update: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            language: storeLanguageInput,
            currency: storeCurrencyInput,
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );

          const store = await updateStoreLocale(input.storeId, {
            language: input.language,
            currency: input.currency,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return store;
        }),
    }),

    domain: router({
      get: protectedProcedure
        .input(z.object({ storeId: storeIdInput }))
        .query(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );
          const domain = await getStoreCustomDomainSettings(input.storeId);
          if (!domain)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          if (!domain.customDomain)
            return {
              state: "not-configured" as const,
              domain: null,
              verifiedAt: null,
              txtName: null,
              txtValue: null,
            };
          const dns = domain.verificationToken
            ? await checkCustomDomainVerification(
                domain.customDomain,
                domain.verificationToken
              )
            : { verified: false, error: true };
          const verified = dns.verified;
          if (verified && !domain.verifiedAt)
            await markStoreCustomDomainVerified(input.storeId);
          return {
            state: verified
              ? ("verified" as const)
              : dns.error
                ? ("error" as const)
                : ("dns-pending" as const),
            domain: domain.customDomain,
            verifiedAt: verified ? (domain.verifiedAt ?? new Date()) : null,
            txtName: `_homsteg-verification.${domain.customDomain}`,
            txtValue: domain.verificationToken,
          };
        }),
      save: protectedProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            domain: z.string().trim().min(1).max(253),
          })
        )
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );
          const normalized = normalizeCustomDomain(input.domain);
          if (!normalized)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Domínio inválido. Introduz apenas o domínio, sem https://, caminhos ou espaços.",
            });
          const token = `homsteg-verify=${randomBytes(24).toString("hex")}`;
          try {
            await saveStoreCustomDomain(input.storeId, normalized, token);
          } catch (error) {
            if ((error as { code?: string })?.code === "23505")
              throw new TRPCError({
                code: "CONFLICT",
                message: "Este domínio já está associado a outra loja.",
              });
            throw error;
          }
          return {
            state: "dns-pending" as const,
            domain: normalized,
            txtName: `_homsteg-verification.${normalized}`,
            txtValue: token,
          };
        }),
      verify: protectedProcedure
        .input(z.object({ storeId: storeIdInput }))
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );
          const domain = await getStoreCustomDomainSettings(input.storeId);
          if (!domain?.customDomain || !domain.verificationToken)
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Guarda um domínio antes de verificar o DNS.",
            });
          const dns = await checkCustomDomainVerification(
            domain.customDomain,
            domain.verificationToken
          );
          if (dns.error)
            return {
              state: "error" as const,
              message:
                "Não foi possível resolver o DNS deste domínio. Confirma o domínio e tenta novamente.",
            };
          if (!dns.verified) {
            return {
              state: "dns-pending" as const,
              message:
                "O registo TXT ainda não foi encontrado. Confirma os dados e tenta novamente após a propagação do DNS.",
            };
          }
          const verified = await markStoreCustomDomainVerified(input.storeId);
          return {
            state: "verified" as const,
            verifiedAt: verified?.customDomainVerifiedAt ?? new Date(),
          };
        }),
      remove: protectedProcedure
        .input(z.object({ storeId: storeIdInput }))
        .mutation(async ({ ctx, input }) => {
          requireStoreAccess(
            await userHasStoreAccess(
              ctx.user.id,
              input.storeId,
              ctx.user.role === "admin"
            )
          );
          await saveStoreCustomDomain(input.storeId, null, null);
          return { state: "not-configured" as const };
        }),
      byHostname: publicProcedure
        .input(z.object({ domain: z.string().trim().max(253) }))
        .query(async ({ input }) => {
          const normalized = normalizeCustomDomain(input.domain);
          if (!normalized)
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          const store = await getPublicStoreByCustomDomain(normalized);
          if (
            !store ||
            !store.customDomainVerificationToken ||
            !(
              await checkCustomDomainVerification(
                normalized,
                store.customDomainVerificationToken
              )
            ).verified
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }
          return { slug: store.slug };
        }),
    }),

    /* ========================================================
       STORE APPLICATION
       ======================================================== */

    application: router({
      create: protectedProcedure
        .input(
          z.object({
            businessTypes: z.array(z.string().trim().min(1).max(100)).min(1),

            fullName: z.string().trim().min(3).max(160),

            /*
             * IMPORTANTE:
             * username foi removido.
             *
             * O nome pessoal do utilizador NÃO é usado
             * como endereço da loja.
             */

            storeName: z.string().trim().min(2).max(120),

            /*
             * O endereço público da loja vem do nome da loja.
             *
             * Exemplos:
             * "Moda Fashion" -> "moda-fashion"
             * "Moda" -> "moda"
             */
            storeSlug: storeSlugInput,

            phone: z.string().trim().min(7).max(40),

            /*
             * Telefone alternativo foi removido.
             */

            whatsapp: optionalText(40),

            country: z.string().trim().min(2).max(80),

            province: optionalText(100),

            district: optionalText(100),

            neighborhood: optionalText(120),

            notes: optionalText(5000),
          })
        )
        .mutation(async ({ ctx, input }) => {
          /*
           * Fluxo HOMSTEG:
           * a loja só é criada depois de o utilizador
           * validar o OTP enviado por email.
           *
           * O gate é verificado diretamente na tabela do
           * Better Auth, fonte da verdade para emailVerified.
           */

          const authUser = await getBetterAuthUserById(ctx.user.openId);

          if (!authUser?.emailVerified) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "Confirma o teu email com o código enviado antes de continuar.",
            });
          }

          try {
            /*
             * A loja é criada usando:
             *
             * storeName -> nome público da loja
             * storeSlug -> endereço público da loja
             *
             * O fullName pertence ao utilizador e não
             * participa na criação do domínio/slug.
             */

            const store = await createStoreForUser({
              userId: ctx.user.id,
              name: input.storeName,
              slug: input.storeSlug,
              whatsapp: input.whatsapp || undefined,
            });

            return {
              success: true,
              store,
            };
          } catch (error) {
            if (
              error instanceof Error &&
              error.message === "STORE_SLUG_ALREADY_EXISTS"
            ) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Já existe uma loja com este endereço.",
              });
            }

            throw error;
          }
        }),
    }),
  }),

  /* ==========================================================
     DASHBOARD
     ========================================================== */

  dashboard: router({
    summary: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        })
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        const summary = await getStoreDashboardSummary(input.storeId);

        if (!summary) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Loja não encontrada.",
          });
        }

        return summary;
      }),
  }),

  /* ==========================================================
     STORAGE / CLOUDFLARE R2
     ========================================================== */

  storage: router({
    /*
     * URL assinada para exibir um asset de branding
     * (logo/banner) da própria loja. A chave tem de
     * pertencer à loja — isolamento entre lojas.
     */
    createImageUrl: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          key: brandingKeyInput,
        })
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        if (!input.key.startsWith(`stores/${input.storeId}/branding/`)) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Ficheiro não pertence à loja selecionada.",
          });
        }

        const imageUrl = await createStoreDownloadUrl(input.key);

        return { imageUrl };
      }),

    createUploadUrl: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          fileName: z.string().trim().min(1).max(255),

          contentType: z.enum([
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        const upload = await createStoreUploadUrl({
          storeId: input.storeId,
          folder: "products",
          fileName: input.fileName,
          contentType: input.contentType,
        });

        const imageUrl = await createStoreDownloadUrl(upload.key);

        return {
          key: upload.key,
          uploadUrl: upload.uploadUrl,
          imageUrl,
        };
      }),
  }),

  /* ==========================================================
     PRODUCTS
     ========================================================== */      products: router({
        listPublic: publicProcedure.query(async () => {
          return listPublicProducts("store-id-placeholder");
        }),
    list: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        })
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        return listProducts(input.storeId);
      }),

    create: protectedProcedure
      .input(productCreateInput)
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        /* ======================================================
           CAPACIDADE DE ESTOQUE: toda loja começa com
           50 produtos grátis; pacotes comprados no
           Market (categoria "stock") somam capacidade
           extra. Produtos arquivados não contam.
           ====================================================== */

        const [stockCapacity, productsUsed] = await Promise.all([
          getStoreStockCapacity(input.storeId),
          countActiveStoreProducts(input.storeId),
        ]);

        if (productsUsed >= stockCapacity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Capacidade de estoque cheia (${productsUsed}/${stockCapacity} produtos). Compra mais capacidade no Market (Estoque).`,
          });
        }

        const productImagePrefix = `stores/${input.storeId}/products/`;

        if (input.imageKeys.some(key => !key.startsWith(productImagePrefix))) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Imagem não pertence à loja selecionada.",
          });
        }

        /*
         * A categoria tem de existir na loja.
         * Vazio ou ausente = Sem categoria (null).
         */
        let category: string | null = null;

        if (input.category && input.category.trim()) {
          const requestedCategory = input.category.trim();

          const storeCategoriesList = await listStoreCategories(input.storeId);

          const match = storeCategoriesList.find(
            category =>
              category.name.localeCompare(requestedCategory, "pt", {
                sensitivity: "accent",
              }) === 0
          );

          if (!match) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Categoria inválida. Cria a categoria na loja antes de a usar.",
            });
          }

          category = match.name;
        }

        /*
         * A referência PERMANENTE da imagem é imageKeys (chave
         * R2) — as URLs de acesso são geradas em cada leitura.
         * Uma URL assinada expira em 7 dias, por isso nunca é
         * persistida: quando chega presigned, converte-mo-la na
         * chave correspondente, desde que pertença à pasta de
         * imagens desta loja (isolamento por tenant).
         */
        const imageKeys = [...input.imageKeys];
        let imageUrl = input.imageUrl ?? null;

        if (imageUrl && isPresignedObjectUrl(imageUrl)) {
          const objectKey = extractStoreObjectKey(imageUrl);

          if (
            objectKey &&
            objectKey.startsWith(productImagePrefix) &&
            !imageKeys.includes(objectKey)
          ) {
            imageKeys.push(objectKey);
          }

          imageUrl = null;
        }

        return insertProduct({
          storeId: input.storeId,
          name: input.name,
          slug: input.slug,
          description: input.description,
          priceMzn: input.priceMzn,
          compareAtPriceMzn: input.compareAtPriceMzn,
          stock: input.stock,
          category,
          imageUrl,
          imageKeys,
          options: input.options,
          variants: alignProductVariants(
            input.options,
            input.variants
          ),
          status: input.status,
          featured: input.featured,
        });
      }),

    update: protectedProcedure
      .input(productUpdateInput)
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        const updates: Partial<InsertProduct> = {};

        if (input.name !== undefined) updates.name = input.name;
        if (input.description !== undefined)
          updates.description = input.description;
        if (input.priceMzn !== undefined) updates.priceMzn = input.priceMzn;
        if (input.compareAtPriceMzn !== undefined)
          updates.compareAtPriceMzn = input.compareAtPriceMzn;
        if (input.stock !== undefined) updates.stock = input.stock;
        if (input.category !== undefined) updates.category = input.category;
        if (input.imageUrl !== undefined) {
          /*
           * URL assinada expira em 7 dias: nunca fica guardada
           * como referência permanente. A referência é
           * imageKeys (chave R2), hidratada em cada leitura.
           */
          updates.imageUrl =
            input.imageUrl && isPresignedObjectUrl(input.imageUrl)
              ? null
              : input.imageUrl;
        }
        if (input.imageKeys !== undefined) updates.imageKeys = input.imageKeys;
        if (input.options !== undefined) updates.options = input.options;

        if (input.variants !== undefined) {
          /*
           * As variantes são alinhadas com as opções EFETIVAS
           * do produto: as enviadas nesta edição ou, numa
           * edição parcial, as já guardadas na base de dados.
           */
          const effectiveOptions =
            input.options ??
            (await getProduct(input.storeId, input.productId))
              ?.options ??
            [];

          updates.variants = alignProductVariants(
            effectiveOptions,
            input.variants
          );
        }
        if (input.status !== undefined) updates.status = input.status;
        if (input.featured !== undefined) updates.featured = input.featured;

        /*
         * Defesa extra (isolamento entre lojas): cada chave
         * de imagem tem de pertencer à própria loja — igual
         * ao products.create.
         */
        if (input.imageKeys !== undefined) {
          const productImagePrefix = `stores/${input.storeId}/products/`;

          if (
            input.imageKeys.some(key => !key.startsWith(productImagePrefix))
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Imagem não pertence à loja selecionada.",
            });
          }
        }

        /*
         * A categoria, quando definida, tem de existir
         * nas categorias reais da loja.
         */
        if (updates.category) {
          const storeCategoriesList = await listStoreCategories(input.storeId);

          const match = storeCategoriesList.find(
            category =>
              category.name.localeCompare(updates.category as string, "pt", {
                sensitivity: "accent",
              }) === 0
          );

          if (!match) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Categoria inválida. Cria a categoria na loja antes de a usar.",
            });
          }

          updates.category = match.name;
        }

        const updated = await updateProduct(
          input.storeId,
          input.productId,
          updates
        );

        if (!updated) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado.",
          });
        }

        return updated;
      }),

    archive: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          productId: z.number().int().positive(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        await archiveProduct(input.storeId, input.productId);

        return {
          success: true,
        } as const;
      }),
  }),

  /* ==========================================================
     STORE CATEGORIES

     Categorias reais criadas pelo utilizador.
     Única fonte do selector de categoria nos produtos.
     ========================================================== */

  categories: router({
    list: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,
        })
      )
      .query(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        return listStoreCategories(input.storeId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          name: z.string().trim().min(1).max(80),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        const existing = await listStoreCategories(input.storeId);

        /*
         * Nome único por loja, case-insensitive.
         */
        const duplicate = existing.find(
          category =>
            category.name.localeCompare(input.name, "pt", {
              sensitivity: "accent",
            }) === 0
        );

        if (duplicate) {
          return duplicate;
        }

        return insertStoreCategory({
          storeId: input.storeId,
          name: input.name,
        });
      }),

    rename: protectedProcedure
      .input(
        z.object({
          storeId: storeIdInput,

          categoryId: z.string().trim().min(1).max(64),

          name: z.string().trim().min(1).max(80),
        })
      )
      .mutation(async ({ ctx, input }) => {
        requireStoreAccess(
          await userHasStoreAccess(
            ctx.user.id,
            input.storeId,
            ctx.user.role === "admin"
          )
        );

        const existing = await listStoreCategories(input.storeId);

        const duplicate = existing.find(
          category =>
            category.id !== input.categoryId &&
            category.name.localeCompare(input.name, "pt", {
              sensitivity: "accent",
            }) === 0
        );

        if (duplicate) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Já existe uma categoria com esse nome.",
          });
        }

        try {
          return await renameStoreCategory({
            storeId: input.storeId,
            categoryId: input.categoryId,
            name: input.name,
          });
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === "STORE_CATEGORY_NOT_FOUND"
          ) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Categoria não encontrada.",
            });
          }

          throw error;
        }
      }),
  }),

  /* ==========================================================
     ADMIN
     ========================================================== */

  admin: router({
    /* ========================================================
       USERS
       ======================================================== */

    users: router({
      list: adminProcedure.query(() => getAdminUsers()),

      delete: adminProcedure
        .input(
          z.object({
            userId: z.number().int().positive(),
          })
        )
        .mutation(async ({ input }) => {
          try {
            const deleted = await deleteAdminUser(input.userId);

            if (!deleted) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Utilizador não encontrado.",
              });
            }

            return {
              success: true,
              user: deleted,
            };
          } catch (error) {
            if (error instanceof Error && error.message === "USER_NOT_FOUND") {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Utilizador não encontrado.",
              });
            }

            throw error;
          }
        }),
    }),

    /* ========================================================
       MARKET FEATURES
       Funcionalidades de personalização do Market,
       administráveis sem tocar em código.
       ======================================================== */

    market: router({
      features: router({
        list: adminProcedure.query(async () => {
          await ensureMarketFeaturesSeeded();

          return listMarketFeatures();
        }),

        /**
         * Cria manualmente uma funcionalidade a partir
         * de um featureKey já definido no catálogo
         * estrutural (shared/market-catalog.ts).
         */
        create: adminProcedure
          .input(
            z.object({
              featureKey: z.string().trim().min(1).max(64),
              name: z.string().trim().min(1).max(120),
              description: z.string().trim().min(1).max(2000),

              /* Todas as categorias do catálogo estrutural —
                 incluindo nav_button, que faltava nesta lista
                 (o Admin não conseguia publicar botões de
                 navegação sem tocar em código). */
              category: z.enum(MARKET_CATEGORIES),
              priceCredits: z.number().int().min(0).max(1_000_000),
              status: z.enum(["active", "inactive"]).default("active"),
              sortOrder: z.number().int().min(0).max(999).default(0),
            })
          )
          .mutation(async ({ input }) => {
            /*
             * A funcionalidade tem de existir no
             * código/estrutura definida. O Admin publica
             * comercialmente o que já existe em código.
             */
            const entry = findMarketCatalogEntry(input.featureKey);

            if (!entry) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "featureKey não existe no catálogo estrutural do Market.",
              });
            }

            try {
              const feature = await insertMarketFeature({
                id: input.featureKey,
                featureKey: input.featureKey,
                name: input.name,
                description: input.description,
                category: entry.category,
                priceCredits: input.priceCredits,
                status: input.status,
                sortOrder: input.sortOrder || entry.sortOrder,
              });

              return { success: true, feature };
            } catch (error) {
              if (
                error instanceof Error &&
                error.message.includes("market_features_feature_key_idx")
              ) {
                throw new TRPCError({
                  code: "CONFLICT",
                  message:
                    "Já existe uma funcionalidade Market com esta referência.",
                });
              }

              throw error;
            }
          }),

        update: adminProcedure
          .input(
            z.object({
              id: z.string().trim().min(1).max(64),
              name: z.string().trim().min(1).max(120).optional(),
              description: z.string().trim().min(1).max(2000).optional(),
              priceCredits: z.number().int().min(0).max(1_000_000).optional(),
              status: z.enum(["active", "inactive"]).optional(),
              sortOrder: z.number().int().min(0).max(999).optional(),
            })
          )
          .mutation(async ({ input }) => {
            const { id, ...patch } = input;

            const feature = await updateMarketFeature(id, patch);

            if (!feature) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Funcionalidade Market não encontrada.",
              });
            }

            return { success: true, feature };
          }),

        /**
         * Ativar/desativar rapidamente (status).
         */
        setStatus: adminProcedure
          .input(
            z.object({
              id: z.string().trim().min(1).max(64),
              status: z.enum(["active", "inactive"]),
            })
          )
          .mutation(async ({ input }) => {
            const feature = await updateMarketFeature(input.id, {
              status: input.status,
            });

            if (!feature) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Funcionalidade Market não encontrada.",
              });
            }
            return { success: true, feature };
          }),
      }),
    }),

    /* ========================================================
       STORES
       ======================================================== */

    stores: router({
      activate: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .mutation(async ({ input }) => {
          const store = await updateStoreStatus(input.storeId, "active");

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store,
          };
        }),

      suspend: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .mutation(async ({ input }) => {
          const store = await updateStoreStatus(input.storeId, "suspended");

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store,
          };
        }),

      delete: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
          })
        )
        .mutation(async ({ input }) => {
          const store = await deleteStore(input.storeId);

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store,
          };
        }),
    }),

    /* ========================================================
       STORE CREDITS
       Gestão manual do saldo de crédito por loja.
       O crédito vive na loja (stores.creditMzn).
       ======================================================== */

    credit: router({
      /**
       * Lista todas as lojas com o saldo atual
       * (inclui lojas com NULL = 0).
       */
      list: adminProcedure.query(() => getAdminUsers()),

      /**
       * Define o saldo absoluto da loja.
       */
      set: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            creditMzn: z.number().int().min(0),
          })
        )
        .mutation(async ({ input }) => {
          const store = await setStoreCreditMzn({
            storeId: input.storeId,
            creditMzn: input.creditMzn,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store: {
              id: store.id,
              creditMzn: store.creditMzn ?? 0,
            },
          };
        }),

      /**
       * Acrescenta (ou subtrai) crédito ao saldo
       * atual. O resultado nunca fica abaixo de 0.
       */
      add: adminProcedure
        .input(
          z.object({
            storeId: storeIdInput,
            amountMzn: z
              .number()
              .int()
              .refine(value => value !== 0, {
                message: "O valor não pode ser zero.",
              }),
          })
        )
        .mutation(async ({ input }) => {
          const store = await addStoreCreditMzn({
            storeId: input.storeId,
            amountMzn: input.amountMzn,
          });

          if (!store) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Loja não encontrada.",
            });
          }

          return {
            success: true,
            store: {
              id: store.id,
              creditMzn: store.creditMzn ?? 0,
            },
          };
        }),
    }),
  }),
});

/* ============================================================
   APP ROUTER TYPE
   ============================================================ */

export type AppRouter = typeof appRouter;
