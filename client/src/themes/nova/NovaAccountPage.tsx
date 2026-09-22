import { useState } from "react";
import {
  MessageCircle,
  CreditCard,
  ShoppingCart,
  PackageCheck,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function NovaAccountPage() {
  const search = useSearch();
  const storeSlug = new URLSearchParams(search)
    .get("storeSlug")
    ?.trim();
  const storeQuery = trpc.stores.bySlug.useQuery(
    { slug: storeSlug ?? "" },
    { enabled: Boolean(storeSlug) },
  );
  const storeName = storeQuery.data?.store.name ??
    (storeSlug ? "Loja" : "NOVA STORE");
  const whatsappNumber = storeQuery.data?.store.whatsapp
    ?.replace(/\D/g, "");
  const storePath = storeSlug
    ? `/store/${encodeURIComponent(storeSlug)}`
    : "/themes/nova";
  const whatsappMessage = encodeURIComponent(
    `Olá, ${storeName}! Gostaria de obter informações sobre uma compra.`,
  );
  const [openSection, setOpenSection] = useState<number | null>(null);

  function toggleSection(index: number) {
    setOpenSection(openSection === index ? null : index);
  }

  function openWhatsApp() {
    if (!whatsappNumber) {
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const sections = [
    {
      title: "Criar conta",
      icon: UserPlus,
      content: (
        <div className="space-y-4">
          <p>
            Nesta loja, <strong>não é necessário criar uma conta para
            realizar uma compra</strong>. Desenvolvemos o nosso processo de
            atendimento de forma simples e direta, para que o cliente possa
            comprar sem precisar passar por etapas desnecessárias de registo.
          </p>

          <p>
            Todo o processo de compra é acompanhado pela nossa equipa através
            do <strong>WhatsApp</strong>. É por esse canal que confirmamos os
            produtos, disponibilidade, quantidades, dados de entrega, valores,
            formas de pagamento e demais informações necessárias para concluir
            o pedido.
          </p>

          <p>
            Dessa forma, o cliente não precisa criar uma conta apenas para
            comprar. Basta escolher o produto na loja, preencher os dados
            necessários no checkout e enviar o pedido pelo WhatsApp. A nossa
            equipa dará continuidade ao atendimento e ajudará em cada etapa.
          </p>

          <p>
            <strong>Por que não exigimos uma conta?</strong> Porque o nosso
            objetivo é tornar a experiência de compra mais rápida, prática e
            personalizada. Em vez de obrigar o cliente a criar uma conta e
            memorizar mais dados de acesso, mantemos o contacto direto com a
            nossa equipa pelo WhatsApp.
          </p>

          <p>
            Assim, mesmo que seja a sua primeira compra, poderá receber
            atendimento personalizado e esclarecer todas as suas dúvidas
            antes de efetuar o pagamento.
          </p>

          <p>
            <strong>Em resumo:</strong> não precisa criar uma conta para
            comprar. Escolha o produto, envie o seu pedido e fale diretamente
            com a nossa equipa pelo WhatsApp.
          </p>
        </div>
      ),
    },

    {
      title: "Produtos",
      icon: PackageCheck,
      content: (
        <div className="space-y-4">
          <p>
            Trabalhamos para disponibilizar uma grande variedade de produtos
            para atender às diferentes necessidades dos nossos clientes. A
            nossa loja apresenta produtos selecionados para facilitar a sua
            escolha e tornar o processo de compra mais simples.
          </p>

          <p>
            <strong>Não encontrou o produto que procura?</strong> Não significa
            que não podemos ajudá-lo. Caso o produto que deseja não esteja
            apresentado na loja, pode simplesmente enviar uma{" "}
            <strong>foto do produto</strong> para a nossa equipa através do
            WhatsApp.
          </p>

          <p>
            A partir da imagem enviada, a nossa equipa irá analisar o produto e
            procurar uma solução para o seu pedido. Desta forma, não precisa
            ficar limitado apenas aos produtos que aparecem atualmente na
            loja.
          </p>

          <p>
            Se viu um produto noutra loja, rede social, site ou simplesmente
            possui uma imagem do produto que deseja,{" "}
            <strong>envie a foto para nós</strong>. A equipa tratará do resto e
            irá informar sobre a disponibilidade, preço e condições para
            realizar a compra.
          </p>

          <p>
            O nosso objetivo é oferecer ao cliente uma experiência de compra
            flexível e personalizada, ajudando-o a encontrar aquilo que
            realmente procura.
          </p>

          <p>
            <strong>Tem uma foto do produto?</strong> Envie-a pelo WhatsApp e
            deixe o resto com a nossa equipa.
          </p>

          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <MessageCircle className="h-5 w-5" />
            Enviar foto pelo WhatsApp
          </button>
        </div>
      ),
    },

    {
      title: "Como funciona o pagamento",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p>
            O processo de pagamento começa depois de escolher os produtos que
            deseja comprar. Primeiro, navegue pela loja, consulte os detalhes
            do produto e escolha a opção de compra.
          </p>

          <p>
            Depois de adicionar o produto ao carrinho, ou selecionar
            diretamente a opção <strong>Comprar</strong>, será encaminhado para
            a página de checkout.
          </p>

          <p>
            No checkout, deverá preencher corretamente os dados necessários
            para o envio da encomenda, incluindo as informações de contacto e
            localização para entrega.
          </p>

          <p>
            Depois de confirmar os dados, encontrará a opção para{" "}
            <strong>Enviar o pedido pelo WhatsApp</strong>. Ao selecionar essa
            opção, as informações da sua encomenda serão encaminhadas para a
            nossa equipa.
          </p>

          <p>
            A partir desse momento, a equipa entra em contacto consigo pelo
            WhatsApp para confirmar os detalhes da compra e orientar sobre o
            pagamento.
          </p>

          <p>
            <strong>Exemplo prático:</strong> imagine que encontrou um produto
            que deseja comprar. Você seleciona <strong>Comprar</strong>,
            preenche os seus dados no checkout e envia o pedido pelo WhatsApp.
            A equipa recebe a solicitação, confirma a disponibilidade e os
            detalhes da encomenda e, em seguida, informa como deverá proceder
            com o pagamento.
          </p>

          <p>
            Este processo foi pensado para oferecer mais segurança e permitir
            que o cliente tenha contacto direto com a equipa antes de concluir
            o pagamento.
          </p>
        </div>
      ),
    },

    {
      title: "Como chegar ao checkout",
      icon: ShoppingCart,
      content: (
        <div className="space-y-4">
          <p>
            O checkout é a etapa onde os dados necessários para preparar e
            enviar a sua encomenda são preenchidos.
          </p>

          <p>
            Para chegar ao checkout, primeiro escolha o produto que deseja
            comprar e clique na opção <strong>Comprar</strong>. Dependendo da
            forma de navegação, também poderá adicioná-lo ao carrinho e depois
            avançar para finalizar a compra.
          </p>

          <p>
            Na página de checkout, confira cuidadosamente os produtos
            selecionados e preencha os seus dados de envio. É importante
            fornecer informações corretas para evitar dificuldades no contacto
            ou na entrega.
          </p>

          <p>
            Depois de preencher tudo, revise as informações antes de enviar o
            pedido. Se estiver tudo correto, utilize a opção{" "}
            <strong>Enviar pedido pelo WhatsApp</strong>.
          </p>

          <p>
            O pedido será então encaminhado para a equipa, que poderá confirmar
            os detalhes e continuar o atendimento consigo pelo WhatsApp.
          </p>

          <p>
            <strong>Dica:</strong> antes de enviar, verifique o nome, número de
            telefone, localização de entrega, produtos e quantidades. Isso
            ajuda a nossa equipa a processar o seu pedido de forma mais rápida.
          </p>
        </div>
      ),
    },

    {
      title: "Confirmação do pedido",
      icon: PackageCheck,
      content: (
        <div className="space-y-4">
          <p>
            Depois de enviar o pedido pelo WhatsApp, a nossa equipa recebe as
            informações da sua compra e inicia o processo de confirmação.
          </p>

          <p>
            A equipa poderá verificar os produtos selecionados, quantidades,
            disponibilidade, dados de entrega e outras informações importantes
            relacionadas com a encomenda.
          </p>

          <p>
            Caso seja necessário corrigir alguma informação ou esclarecer
            alguma dúvida, o atendimento será feito diretamente pelo WhatsApp.
          </p>

          <p>
            A confirmação final permite garantir que o cliente e a equipa
            possuem as mesmas informações sobre a compra antes de avançar para
            o pagamento e para o processo de preparação da encomenda.
          </p>

          <p>
            <strong>
              Por isso, enviar o pedido pelo checkout não significa
              necessariamente que o pagamento já foi realizado.
            </strong>{" "}
            O WhatsApp é utilizado para a comunicação, confirmação e
            orientação das etapas seguintes.
          </p>

          <p>
            Esse contacto direto ajuda a reduzir erros e proporciona um
            atendimento mais próximo e personalizado durante a compra.
          </p>
        </div>
      ),
    },

    {
      title: "Continuar para WhatsApp",
      icon: MessageCircle,
      content: (
        <div className="space-y-4">
          <p>
            O WhatsApp é um dos principais canais de atendimento utilizados
            para acompanhar o processo de compra.
          </p>

          <p>
            Através do WhatsApp, poderá falar diretamente com a nossa equipa
            para esclarecer dúvidas, confirmar informações do pedido, receber
            orientações sobre o pagamento e tratar de outros detalhes
            relacionados com a sua compra.
          </p>

          <p>
            Se já escolheu um produto ou simplesmente deseja obter mais
            informações antes de comprar, pode entrar em contacto com a equipa
            para receber atendimento.
          </p>

          <p>
            <strong>Quer continuar?</strong> Clique no botão abaixo para abrir
            o WhatsApp e iniciar a conversa.
          </p>

          <button
            type="button"
            onClick={openWhatsApp}
            disabled={!whatsappNumber}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-green-600
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-green-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <MessageCircle className="h-5 w-5" />
            Continuar para WhatsApp
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-3xl">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-5 py-6 dark:border-gray-800 sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {storeName}
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Informações importantes para a sua compra
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Informações
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Saiba mais sobre o processo de compra e atendimento.
              </p>
            </div>

            <div className="space-y-3">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isOpen = openSection === index;

                return (
                  <div
                    key={section.title}
                    className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(index)}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        px-4
                        py-4
                        text-left
                        transition
                        hover:bg-gray-50
                        dark:hover:bg-gray-800/50
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Icon className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />

                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {section.title}
                        </span>
                      </div>

                      <ChevronDown
                        className={`
                          h-5
                          w-5
                          shrink-0
                          text-gray-400
                          transition-transform
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-200 px-4 pb-5 pt-4 dark:border-gray-800">
                        <div className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                          {section.content}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-7 border-t border-gray-200 pt-6 text-center dark:border-gray-800">
              <Link
                href={storePath}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-600
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-700
                "
              >
                Voltar à loja
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
