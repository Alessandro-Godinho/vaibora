/**
 * hotels-rec.js — Vaibora
 * Injeta automaticamente a seção "Hotéis Recomendados" em cada página de destino.
 * Detecta a página atual via pathname e renderiza os cards de 3 categorias.
 */
(function () {
  'use strict';

  /* ── CSS ── */
  var CSS = `
    .hr-section{margin:2.5rem 0 0;}
    .hr-title-wrap{margin-bottom:1.1rem;}
    .hr-h2{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#6b6b65;text-transform:uppercase;letter-spacing:1px;padding-bottom:0.5rem;border-bottom:2px solid #ffd080;display:inline-block;margin-bottom:0.4rem;}
    .hr-sub{font-size:0.8rem;color:#6b6b65;line-height:1.55;margin-top:0.3rem;}
    .hr-tabs{display:flex;gap:6px;margin-bottom:1.1rem;flex-wrap:wrap;}
    .hr-tab{font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;padding:7px 16px;border-radius:20px;border:1.5px solid #e0ddd6;background:white;color:#6b6b65;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:5px;}
    .hr-tab:hover{border-color:#888;color:#1a1a18;}
    .hr-tab.eco-on{background:#e6f4ee;border-color:#1a6b3c;color:#1a6b3c;}
    .hr-tab.mid-on{background:#e8f0fe;border-color:#1a56a0;color:#1a56a0;}
    .hr-tab.lux-on{background:#fef8e0;border-color:#c4960f;color:#9a6800;}
    .hr-panel{display:none;}
    .hr-panel.on{display:block;}
    .hr-card{background:white;border:1.5px solid #e0ddd6;border-radius:14px;padding:1.3rem;position:relative;overflow:hidden;}
    .hr-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
    .hr-card.eco::before{background:linear-gradient(90deg,#1a6b3c,#2ecc71);}
    .hr-card.mid::before{background:linear-gradient(90deg,#1a56a0,#4a90d9);}
    .hr-card.lux::before{background:linear-gradient(90deg,#c4960f,#f0c040);}
    .hr-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;margin-bottom:0.7rem;}
    .hr-badge{font-size:0.68rem;font-weight:600;padding:3px 9px;border-radius:12px;display:inline-block;margin-bottom:4px;}
    .hr-badge.eco{background:#e6f4ee;color:#1a6b3c;}
    .hr-badge.mid{background:#e8f0fe;color:#1a56a0;}
    .hr-badge.lux{background:#fef8e0;color:#9a6800;}
    .hr-name{font-family:'Syne',sans-serif;font-weight:700;font-size:1rem;margin:2px 0;}
    .hr-loc{font-size:0.76rem;color:#6b6b65;}
    .hr-right{text-align:right;flex-shrink:0;}
    .hr-stars{color:#d4900a;font-size:0.82rem;letter-spacing:1px;}
    .hr-nota{display:inline-flex;align-items:center;gap:3px;background:#1a6b3c;color:white;font-size:0.75rem;font-weight:700;padding:3px 9px;border-radius:6px;margin-top:4px;}
    .hr-desc{font-size:0.83rem;color:#6b6b65;line-height:1.6;margin-bottom:0.9rem;}
    .hr-feats{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem;}
    .hr-feat{font-size:0.71rem;background:#f4f2ee;color:#6b6b65;padding:3px 9px;border-radius:12px;}
    .hr-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;padding-top:0.8rem;border-top:1px solid #f4f2ee;}
    .hr-price{font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;color:#1a1a18;line-height:1.3;}
    .hr-price small{font-family:'DM Sans',sans-serif;font-size:0.69rem;font-weight:400;color:#6b6b65;display:block;}
    .hr-btn{display:inline-block;background:#c4960f;color:white;font-size:0.78rem;font-weight:600;padding:8px 18px;border-radius:8px;text-decoration:none;transition:opacity .15s;white-space:nowrap;}
    .hr-btn:hover{opacity:0.88;}
  `;

  /* ── DADOS DOS HOTÉIS ── */
  var DATA = {
    'salvador': {
      t: 'Onde Ficar em Salvador',
      s: 'Barra para praia e vida noturna · Pelourinho para cultura · Rio Vermelho para o ambiente boêmio local',
      eco: { n:'ibis Salvador Aeroporto', st:3, nt:'8.2', b:'Paralela / Iguatemi', p:'A partir de R$ 160/noite', f:['Wi-Fi grátis','Estacionamento','Próximo ao metrô'], d:'Ótimo custo-benefício para quem chega ou sai de Salvador. Acesso fácil ao metrô para o centro histórico e Barra.' },
      mid: { n:'Hotel Zank by Toque', st:4, nt:'9.0', b:'Rio Vermelho', p:'A partir de R$ 380/noite', f:['Rooftop com vista','Design boutique','Bairro boêmio'], d:'Boutique hotel no coração do Rio Vermelho, bairro favorito dos soteropolitanos. Perto de bares, restaurantes e a poucos minutos da praia.' },
      lux: { n:'Fera Palace Hotel', st:5, nt:'9.3', b:'Centro Histórico / Pelourinho', p:'A partir de R$ 750/noite', f:['Piscina na cobertura','Restaurante gourmet','Patrimônio tombado','Vista Baía de Todos os Santos'], d:'Instalado em palacete histórico de 1934 no coração do Pelourinho. Vista incrível da Baía de Todos os Santos e café da manhã baiano completo.' }
    },
    'recife-olinda': {
      t: 'Onde Ficar em Recife e Olinda',
      s: 'Boa Viagem para praia e conveniência · Olinda para imersão cultural · Recife Antigo para o agito',
      eco: { n:'ibis Recife Boa Viagem', st:3, nt:'8.3', b:'Boa Viagem', p:'A partir de R$ 165/noite', f:['A 200m da praia','Wi-Fi grátis','Café da manhã'], d:'Localização imbatível em Boa Viagem, a 200 metros do calçadão. Ótimo ponto de partida para explorar Recife e Olinda.' },
      mid: { n:'Mercure Recife Navegantes', st:4, nt:'8.6', b:'Boa Viagem', p:'A partir de R$ 340/noite', f:['Piscina','Restaurante','Academia'], d:'Hotel sólido e bem localizado em Boa Viagem, com piscina e boa estrutura para negócios e lazer. Fácil acesso a Olinda.' },
      lux: { n:'Hotel Atlante Plaza', st:5, nt:'9.1', b:'Boa Viagem — frente ao mar', p:'A partir de R$ 650/noite', f:['Frente ao mar','Piscina de borda infinita','SPA','Restaurante panorâmico'], d:'O hotel mais icônico de Recife com vista privilegiada para o Oceano Atlântico e os recifes naturais. Piscina de borda infinita e gastronomia refinada.' }
    },
    'porto-de-galinhas': {
      t: 'Onde Ficar em Porto de Galinhas',
      s: 'Centro de Porto de Galinhas para os arrecifes · Praia do Cupe para hotéis beira-mar · Muro Alto para resorts exclusivos',
      eco: { n:'Laguna Beach Flat', st:3, nt:'9.1', b:'Centro de Porto de Galinhas', p:'A partir de R$ 200/noite', f:['Piscina','Próximo aos arrecifes','Boa localização'], d:'Flat bem avaliado no centro de Porto de Galinhas, perto das jangadas para os arrecifes naturais e das melhores pousadas da vila.' },
      mid: { n:'Kembali Hotel', st:4, nt:'9.1', b:'Praia do Cupe — beira-mar', p:'A partir de R$ 1.130/noite', f:['Frente ao mar','Design exclusivo','Piscina','Café da manhã'], d:'Um dos hotéis mais charmosos e bem avaliados de Porto de Galinhas, localizado de frente para o mar na Praia do Cupe. Ambiente sofisticado e aconchegante.' },
      lux: { n:'Nannai Muro Alto Resort & Spa', st:5, nt:'9.5', b:'Muro Alto', p:'A partir de R$ 2.500/noite', f:['Bangalôs com piscina privativa','SPA premiado','Gastronomia de autor','Frente ao mar'], d:'Eleito diversas vezes o melhor resort do Brasil. Bangalôs exclusivos com piscina particular, SPA de alto padrão e experiência gastronômica premiada frente ao mar de Muro Alto.' }
    },
    'maragogi': {
      t: 'Onde Ficar em Maragogi',
      s: 'Centro de Maragogi próximo às galés · Barra Grande para ambiente mais reservado',
      eco: { n:'Pousada Recanto do Mar', st:3, nt:'8.3', b:'Centro de Maragogi', p:'A partir de R$ 180/noite', f:['Piscina','Café da manhã','Próximo às galés'], d:'Ótima opção econômica no centro de Maragogi, perto do trapiche onde saem as lanchas para as galés — piscinas naturais únicas.' },
      mid: { n:'Hotel Salinas de Maragogi', st:4, nt:'8.9', b:'Maragogi — frente ao mar', p:'A partir de R$ 550/noite', f:['Frente ao mar','All-inclusive','Piscinas','Passeios inclusos'], d:'Resort bem estruturado com praia privativa e opção all-inclusive. Passeios às galés saem diretamente do hotel.' },
      lux: { n:'Kenoa Resort Beach Spa & Villas', st:5, nt:'9.6', b:'Barra de São Miguel', p:'A partir de R$ 2.500/noite', f:['Villas privativas','SPA exclusivo','Gastronomia de alto nível','Praia deserta'], d:'Um dos resorts mais exclusivos do Brasil, com villas à beira de praia deserta, design premiado e experiência completamente personalizada.' }
    },
    'maceio': {
      t: 'Onde Ficar em Maceió',
      s: 'Pajuçara e Ponta Verde são os bairros ideais — frente ao mar com piscinas naturais a 200m',
      eco: { n:'ibis Maceió Pajuçara', st:3, nt:'8.1', b:'Pajuçara', p:'A partir de R$ 155/noite', f:['A 100m da praia','Wi-Fi grátis','Café da manhã'], d:'Posição central em Pajuçara, a 100m das famosas piscinas naturais de Maceió e do mercado de artesanato local.' },
      mid: { n:'Ritz Suítes Maceió', st:4, nt:'8.7', b:'Ponta Verde', p:'A partir de R$ 360/noite', f:['Piscina','Vista mar','Apartamentos espaçosos'], d:'Suítes confortáveis em Ponta Verde com boa vista para o mar. Bairro animado com excelentes restaurantes de frutos do mar.' },
      lux: { n:'Jatiúca Hotel & Resort', st:5, nt:'9.0', b:'Jatiúca — frente ao mar', p:'A partir de R$ 680/noite', f:['Frente ao mar','SPA','Restaurante gourmet','Múltiplas piscinas'], d:'O resort mais completo de Maceió, com acesso direto à praia de Jatiúca, SPA completo e gastronomia de qualidade.' }
    },
    'natal': {
      t: 'Onde Ficar em Natal',
      s: 'Ponta Negra é a melhor localização — Morro do Careca, vida noturna e a famosa praia em frente',
      eco: { n:'ibis Natal Ponta Negra', st:3, nt:'8.2', b:'Ponta Negra', p:'A partir de R$ 160/noite', f:['Perto do Morro do Careca','Wi-Fi grátis','Café da manhã'], d:'Excelente custo-benefício em Ponta Negra, próximo ao famoso Morro do Careca e ao agitado calçadão da praia.' },
      mid: { n:'Ocean Palace Beach Resort', st:4, nt:'8.8', b:'Ponta Negra — frente ao mar', p:'A partir de R$ 420/noite', f:['Frente ao mar','Piscinas','Quadras esportivas','Restaurante'], d:'Resort bem localizado na orla de Ponta Negra com estrutura de lazer completa e acesso direto à praia.' },
      lux: { n:'Pestana Natal Beach Resort', st:5, nt:'9.1', b:'Ponta Negra — beira-mar', p:'A partir de R$ 780/noite', f:['SPA','Múltiplas piscinas','Gastronomia refinada','Acesso à praia'], d:'O mais sofisticado de Natal, com SPA completo, gastronomia de alto nível e posição privilegiada na orla de Ponta Negra.' }
    },
    'jericoacoara': {
      t: 'Onde Ficar em Jericoacoara',
      s: 'A Vila de Jeri é compacta — fique no centro para chegar a pé à Duna do Pôr do Sol e Pedra Furada',
      eco: { n:'Pousada do Vento', st:3, nt:'8.5', b:'Centro da Vila de Jeri', p:'A partir de R$ 220/noite', f:['Piscina','Café da manhã','5 min da duna do pôr do sol'], d:'Pousada charmosa no centro de Jericoacoara, a 5 minutos a pé da Duna do Pôr do Sol e dos principais bares da vila.' },
      mid: { n:'Rancho do Peixe', st:4, nt:'9.1', b:'Preá (30 min de Jeri)', p:'A partir de R$ 620/noite', f:['Frente ao mar','Kitesurf incluso','Gastronomia premiada','Bangalôs rústicos'], d:'Resort premiado no Preá com bangalôs confortáveis, acesso à melhor praia de kitesurf e cozinha de autor.' },
      lux: { n:'Vila Kalango', st:5, nt:'9.4', b:'Centro da Vila de Jeri', p:'A partir de R$ 1.400/noite', f:['Quartos exclusivos','SPA','Gastronomia premiada','Piscina privativa'], d:'O mais exclusivo de Jericoacoara, com design sofisticado, gastronomia premiada e atendimento personalizado. Localização privilegiada na vila.' }
    },
    'jericoacoara-extra': {
      t: 'Onde Ficar em Jericoacoara',
      s: 'A Vila de Jeri é compacta — fique no centro para chegar a pé à Duna do Pôr do Sol e Pedra Furada',
      eco: { n:'Pousada do Vento', st:3, nt:'8.5', b:'Centro da Vila de Jeri', p:'A partir de R$ 220/noite', f:['Piscina','Café da manhã','5 min da duna do pôr do sol'], d:'Pousada charmosa no centro de Jericoacoara, a 5 minutos a pé da Duna do Pôr do Sol e dos principais bares da vila.' },
      mid: { n:'Rancho do Peixe', st:4, nt:'9.1', b:'Preá (30 min de Jeri)', p:'A partir de R$ 620/noite', f:['Frente ao mar','Kitesurf incluso','Gastronomia premiada','Bangalôs rústicos'], d:'Resort premiado no Preá com bangalôs confortáveis, acesso à melhor praia de kitesurf e cozinha de autor.' },
      lux: { n:'Vila Kalango', st:5, nt:'9.4', b:'Centro da Vila de Jeri', p:'A partir de R$ 1.400/noite', f:['Quartos exclusivos','SPA','Gastronomia premiada','Piscina privativa'], d:'O mais exclusivo de Jericoacoara, com design sofisticado, gastronomia premiada e atendimento personalizado. Localização privilegiada na vila.' }
    },
    'bonito': {
      t: 'Onde Ficar em Bonito',
      s: 'Centro de Bonito (MS) é o ponto ideal — acesso a todos os atrativos e translados organizados',
      eco: { n:'Pousada Muito Bonito', st:3, nt:'8.4', b:'Centro de Bonito', p:'A partir de R$ 200/noite', f:['Piscina','Café da manhã','Apoio com passeios'], d:'Pousada bem avaliada no centro de Bonito, com equipe prestativa que ajuda a organizar os passeios e translados.' },
      mid: { n:'Hotel Zagaia Eco Resort', st:4, nt:'8.9', b:'Área rural de Bonito', p:'A partir de R$ 480/noite', f:['Piscinas de água cristalina','Área verde nativa','Restaurante','Estrutura completa'], d:'Eco resort com piscinas de água cristalina dentro do próprio hotel, no meio da mata. Experiência única sem sair da hospedagem.' },
      lux: { n:'Refúgio Ecológico Caiman', st:5, nt:'9.5', b:'Pantanal sul-mato-grossense', p:'A partir de R$ 2.200/noite', f:['Safári no Pantanal','Guias especializados','Gastronomia de autor','Lodge exclusivo'], d:'Um dos melhores lodges do Brasil, combinando Pantanal e ecoturismo de excelência. Safáris fotográficos com biólogos especialistas.' }
    },
    'chapada-diamantina': {
      t: 'Onde Ficar na Chapada Diamantina',
      s: 'Lençóis é a base ideal — cidade histórica com acesso fácil às principais trilhas e cachoeiras',
      eco: { n:'Pousada Casa de Pedra', st:3, nt:'8.6', b:'Centro histórico de Lençóis', p:'A partir de R$ 180/noite', f:['Café da manhã baiano','No centro histórico','Varanda com vista'], d:'Pousada charmosa em casarão histórico no centro de Lençóis, a 5 minutos a pé de restaurantes e guias de trilha.' },
      mid: { n:'Hotel de Lençóis', st:4, nt:'8.9', b:'Lençóis — beira do rio', p:'A partir de R$ 380/noite', f:['Piscina','Vista para o rio','Restaurante','Parceria com guias'], d:'O melhor hotel da cidade de Lençóis, com piscina, vista para o Rio Lençóis e parceria com guias certificados da Chapada.' },
      lux: { n:'Canto das Águas', st:4, nt:'9.2', b:'Beira do Rio Lençóis', p:'A partir de R$ 580/noite', f:['À beira do rio','Piscina natural','Spa','Gastronomia regional'], d:'Hotel boutique à margem do Rio Lençóis, com piscina natural integrada ao rio, spa e a melhor experiência gastronômica da Chapada Diamantina.' }
    },
    'lencois-maranhenses': {
      t: 'Onde Ficar nos Lençóis Maranhenses',
      s: 'Barreirinhas é a base principal · Santo Amaro para imersão · Atins para experiência mais exclusiva',
      eco: { n:'Pousada Lins', st:3, nt:'8.3', b:'Barreirinhas', p:'A partir de R$ 190/noite', f:['Piscina','Café da manhã','Translados disponíveis'], d:'Boa pousada em Barreirinhas, ponto de partida para os passeios aos lençóis. Equipe organiza todos os translados.' },
      mid: { n:'Pousada do Buriti', st:4, nt:'9.0', b:'Barreirinhas — beira do Rio Preguiças', p:'A partir de R$ 380/noite', f:['À beira do Rio Preguiças','Piscina','Café da manhã especial','Pacotes de passeios'], d:'Pousada à beira do Rio Preguiças com infraestrutura confortável e pacotes de passeios bem organizados aos lençóis.' },
      lux: { n:'Pousada Encantes do Nordeste', st:4, nt:'9.4', b:'Atins — dentro do parque', p:'A partir de R$ 950/noite', f:['Dentro do parque','Acesso exclusivo','Bangalôs privativos','Vista para as dunas'], d:'A hospedagem mais exclusiva da região, em Atins, com acesso direto às lagoas mais remotas dos Lençóis Maranhenses. Experiência transformadora.' }
    },
    'sao-luis': {
      t: 'Onde Ficar em São Luís',
      s: 'Centro Histórico (Praia Grande) para imersão cultural · Ponta d\'Areia e São Marcos para a praia',
      eco: { n:'ibis São Luís', st:3, nt:'8.1', b:'Centro de São Luís', p:'A partir de R$ 150/noite', f:['Wi-Fi grátis','Estacionamento','Próximo ao centro histórico'], d:'Opção prática e bem avaliada próxima ao centro histórico de São Luís. Boa base para explorar os azulejos e o Bumba meu boi.' },
      mid: { n:'Grand São Luís Hotel', st:4, nt:'8.6', b:'São Francisco', p:'A partir de R$ 320/noite', f:['Piscina na cobertura','Restaurante','Vista para o mar'], d:'Hotel bem posicionado com piscina na cobertura e boa vista para o litoral. Acesso rápido ao centro histórico e às praias.' },
      lux: { n:'Pestana São Luís Resort', st:5, nt:'9.0', b:'Calhau — beira-mar', p:'A partir de R$ 650/noite', f:['Frente ao mar','SPA','Múltiplas piscinas','Gastronomia regional'], d:'O mais completo de São Luís, com estrutura de resort à beira do Atlântico, SPA e excelente cozinha maranhense contemporânea.' }
    },
    'delta-do-parnaiba': {
      t: 'Onde Ficar no Delta do Parnaíba',
      s: 'Parnaíba como base logística · Ilha Grande do Paulino para imersão total no delta',
      eco: { n:'Pousada Solar dos Ventos', st:3, nt:'8.2', b:'Parnaíba', p:'A partir de R$ 160/noite', f:['Piscina','Café da manhã','Organização de passeios'], d:'Pousada confortável em Parnaíba, principal cidade de acesso ao Delta. Equipe auxilia na contratação de barcos e guias.' },
      mid: { n:'Hotel Cívico', st:4, nt:'8.7', b:'Centro de Parnaíba', p:'A partir de R$ 290/noite', f:['Piscina','Restaurante','Café da manhã reforçado'], d:'Melhor hotel do centro de Parnaíba, com boa estrutura e equipe bem informada sobre os passeios no delta.' },
      lux: { n:'Pousada do Piauí Eco Resort', st:4, nt:'9.1', b:'Ilha Grande do Paulino', p:'A partir de R$ 750/noite', f:['Dentro do delta','Bangalôs à beira d\'água','Pesca e canoa','Natureza preservada'], d:'Experiência única dentro do próprio Delta do Parnaíba, com bangalôs sobre a água, pesca artesanal e paisagens deslumbrantes.' }
    },
    'porto-seguro': {
      t: 'Onde Ficar em Porto Seguro',
      s: 'Arraial d\'Ajuda para charme · Porto Seguro centro para agito · Taperapuã para resorts',
      eco: { n:'ibis Porto Seguro', st:3, nt:'8.0', b:'Centro de Porto Seguro', p:'A partir de R$ 170/noite', f:['Wi-Fi grátis','Estacionamento','Próximo à orla'], d:'Boa opção econômica no centro de Porto Seguro, perto da orla e das passarelas noturnas mais animadas.' },
      mid: { n:'Arraial Bangalô Praia Hotel', st:4, nt:'8.9', b:'Arraial d\'Ajuda', p:'A partir de R$ 420/noite', f:['Frente ao mar','Bangalôs privativos','Piscina','Café da manhã'], d:'Bangalôs encantadores frente ao mar em Arraial d\'Ajuda. Ambiente tranquilo e exclusivo, a 5 min do centrinho animado.' },
      lux: { n:'Tivoli Ecoresort Praia do Forte', st:5, nt:'9.3', b:'Taperapuã', p:'A partir de R$ 1.200/noite', f:['Frente à praia de Taperapuã','SPA','Parque aquático','All-inclusive disponível'], d:'Resort de altíssimo padrão frente à famosa Praia de Taperapuã, com SPA completo, parque aquático e gastronomia exclusiva.' }
    },
    'morro-de-sao-paulo': {
      t: 'Onde Ficar em Morro de São Paulo',
      s: '1ª Praia para agito · 2ª Praia para equilíbrio perfeito · 3ª e 4ª Praia para tranquilidade total',
      eco: { n:'Pousada Colibri', st:3, nt:'8.3', b:'2ª Praia', p:'A partir de R$ 220/noite', f:['Perto da praia','Café da manhã','Piscina'], d:'Pousada charmosa na 2ª Praia, a melhor localização de Morro — equilíbrio entre agito e tranquilidade.' },
      mid: { n:'Pousada Natureza', st:4, nt:'9.0', b:'2ª Praia — frente ao mar', p:'A partir de R$ 480/noite', f:['Frente ao mar','Piscina','Bangalôs','Café da manhã especial'], d:'Pousada de alto padrão na 2ª Praia com vista deslumbrante para o mar, bangalôs confortáveis e café da manhã farto.' },
      lux: { n:'Anantara Morro de São Paulo Resort', st:5, nt:'9.5', b:'3ª Praia', p:'A partir de R$ 2.800/noite', f:['SPA Anantara','Villas privativas','Gastronomia internacional','Praia exclusiva'], d:'O mais luxuoso do Morro, da rede Anantara. Villas privativas com piscina, SPA de renome mundial e gastronomia de nível internacional.' }
    },
    'trancoso': {
      t: 'Onde Ficar em Trancoso',
      s: 'O Quadrado é a localização mais cobiçada · Praia do Espelho para total exclusividade',
      eco: { n:'Pousada Calypso', st:3, nt:'8.2', b:'Próximo ao Quadrado', p:'A partir de R$ 280/noite', f:['Perto do Quadrado','Café da manhã','Piscina'], d:'Pousada simpática próxima ao famoso Quadrado de Trancoso. Boa opção para explorar a cidade sem gastar uma fortuna.' },
      mid: { n:'Pousada Etnia', st:4, nt:'9.1', b:'Quadrado de Trancoso', p:'A partir de R$ 780/noite', f:['No Quadrado histórico','Design exclusivo','Jardins tropicais','Piscina'], d:'Uma das pousadas mais charmosas do Quadrado, com decoração única e jardins exuberantes no coração de Trancoso.' },
      lux: { n:'UXUA Casa Hotel & Spa', st:5, nt:'9.8', b:'Quadrado de Trancoso', p:'A partir de R$ 3.500/noite', f:['Casas históricas privativas','SPA premiado','Gastronomia mundial','Piscinas privativas'], d:'Referência mundial em luxo discreto, o UXUA ocupa casas históricas do século XVII no Quadrado. Indicado por Condé Nast como um dos melhores hotéis do mundo.' }
    },
    'corumbau': {
      t: 'Onde Ficar em Corumbau',
      s: 'Corumbau é pequeno e exclusivo — fique próximo à praia principal para o Parque Marinho',
      eco: { n:'Pousada Mar de Dentro', st:3, nt:'8.4', b:'Corumbau', p:'A partir de R$ 250/noite', f:['Café da manhã','Perto da praia','Ambiente tranquilo'], d:'Pousada simples e bem avaliada em Corumbau, perfeita para quem busca descanso total longe do turismo de massa.' },
      mid: { n:'Pousada Araponga', st:4, nt:'9.1', b:'Corumbau — frente ao mar', p:'A partir de R$ 620/noite', f:['Frente ao mar','Bangalôs ecológicos','Cozinha autoral'], d:'Pousada boutique frente ao mar com bangalôs ecológicos e cozinha de autor. Experiência exclusiva em um dos destinos mais preservados do Brasil.' },
      lux: { n:'Patachocas Guest House', st:5, nt:'9.6', b:'Corumbau — beira-mar', p:'A partir de R$ 1.800/noite', f:['Ultra-exclusivo','SPA na natureza','Gastronomia premiada','Atendimento personalizado'], d:'Um dos endereços mais exclusivos da Bahia, com apenas 9 bangalôs frente ao mar, jardins tropicais e serviço impecável.' }
    },
    'arraial-do-cabo': {
      t: 'Onde Ficar em Arraial do Cabo',
      s: 'Centro de Arraial ou Praia Grande para boa localização · Búzios como base alternativa sofisticada',
      eco: { n:'Pousada Costa Azul', st:3, nt:'8.3', b:'Centro de Arraial do Cabo', p:'A partir de R$ 195/noite', f:['Café da manhã','Piscina','Próximo às balsas'], d:'Boa pousada no centro de Arraial, fácil acesso às embarcações para mergulho nas águas turquesa cristalinas.' },
      mid: { n:'Solar Búzios Hotel', st:4, nt:'8.7', b:'Búzios (30 min)', p:'A partir de R$ 420/noite', f:['Piscina','Vista para o mar','Spa','Café da manhã especial'], d:'Ótima alternativa em Búzios, combinando sofisticação do balneário com acesso fácil às praias desertas de Arraial do Cabo.' },
      lux: { n:'Insolito Boutique Hotel', st:5, nt:'9.4', b:'Búzios — Ferradura', p:'A partir de R$ 1.600/noite', f:['Design premiado','SPA','Gastronomia internacional','Vista panorâmica'], d:'Boutique hotel de altíssimo padrão em Búzios, com arquitetura premiada, SPA e gastronomia de nível internacional. Base perfeita para Arraial do Cabo.' }
    },
    'fernando-de-noronha': {
      t: 'Onde Ficar em Fernando de Noronha',
      s: 'Vila dos Remédios é o centro da ilha · Floresta Velha para proximidade com as melhores praias',
      eco: { n:'Pousada Teju-Açu', st:3, nt:'8.5', b:'Vila dos Remédios', p:'A partir de R$ 650/noite', f:['Café da manhã tropical','Wi-Fi','Próximo ao centro'], d:'Em Noronha não há opção barata, mas esta é a mais acessível com boa avaliação — na Vila dos Remédios, perto de tudo.' },
      mid: { n:'Pousada dos Corais', st:4, nt:'9.0', b:'Floresta Velha', p:'A partir de R$ 1.100/noite', f:['Vista para o mar','Café da manhã premium','Piscina','Aluguel de buggies'], d:'Pousada de alto nível em Floresta Velha com vista para o Atlântico, café da manhã farto e equipe que auxilia com todos os passeios da ilha.' },
      lux: { n:'Pousada Maravilha', st:5, nt:'9.7', b:'Floresta Velha — vista privilegiada', p:'A partir de R$ 3.800/noite', f:['Bungalôs sobre o mar','Piscina de borda infinita','Gastronomia exclusiva','Serviço personalizado'], d:'Considerada a melhor pousada de Noronha e uma das mais exclusivas do Brasil. Bangalôs com piscina particular e vista incrível para o Atlântico.' }
    },
    'rio-de-janeiro': {
      t: 'Onde Ficar no Rio de Janeiro',
      s: 'Copacabana para praticidade e praia · Ipanema para estilo · Santa Teresa para charme boêmio',
      eco: { n:'ibis Rio de Janeiro Copacabana', st:3, nt:'8.2', b:'Copacabana', p:'A partir de R$ 195/noite', f:['A 2 min da praia','Wi-Fi grátis','Metrô Cardeal Arcoverde próximo'], d:'Localização imbatível em Copacabana, a 2 minutos a pé da praia. Custo-benefício excelente para explorar o Rio de Janeiro.' },
      mid: { n:'Windsor Excelsior Hotel', st:4, nt:'8.9', b:'Copacabana — beira-mar', p:'A partir de R$ 480/noite', f:['Frente ao mar','Piscina na cobertura','SPA','Vista para o Pão de Açúcar'], d:'Hotel de alto padrão em frente à Praia de Copacabana com piscina panorâmica no rooftop e vista deslumbrante para o Pão de Açúcar.' },
      lux: { n:'Belmond Copacabana Palace', st:5, nt:'9.6', b:'Copacabana — Av. Atlântica', p:'A partir de R$ 2.200/noite', f:['Ícone histórico de 1923','Piscina olímpica beira-mar','Restaurante La Cuisine','SPA Guerlain'], d:'O hotel mais famoso do Brasil. Piscina olímpica à beira da Avenida Atlântica e gastronomia de nível mundial. Preferido de realeza e celebridades.' }
    },
    'paraty': {
      t: 'Onde Ficar em Paraty',
      s: 'Centro Histórico para imersão total · Laranjeiras para resort · arredores para natureza preservada',
      eco: { n:'Pousada Cor de Rosa', st:3, nt:'8.5', b:'Centro Histórico de Paraty', p:'A partir de R$ 220/noite', f:['No centro histórico','Café da manhã colonial','Varanda charmosa'], d:'Pousada aconchegante em casarão colonial no coração do centro histórico de Paraty. Acorda com o som das pedras coloniais.' },
      mid: { n:'Pousada do Sandi', st:4, nt:'9.1', b:'Centro Histórico de Paraty', p:'A partir de R$ 520/noite', f:['Casarão colonial do séc. XVIII','Piscina','Restaurante premiado','Dentro do centro histórico'], d:'Hotel boutique em casarão colonial do século XVIII, com piscina e restaurante premiado dentro do centro histórico tombado pela UNESCO.' },
      lux: { n:'Fasano Angra dos Reis', st:5, nt:'9.5', b:'Costa Verde (próximo)', p:'A partir de R$ 2.400/noite', f:['Resort em ilha privativa','Marina própria','SPA Fasano','Gastronomia premiada'], d:'O icônico Fasano em resort privativo na Costa Verde, com marina, SPA e a gastronomia da melhor rede hoteleira do Brasil. Perfeito para combinar com Paraty.' }
    },
    'ilha-grande': {
      t: 'Onde Ficar na Ilha Grande',
      s: 'Vila do Abraão é o único centro — fique próximo ao cais para facilitar os passeios de barco',
      eco: { n:'Pousada Naturália', st:3, nt:'8.4', b:'Vila do Abraão', p:'A partir de R$ 200/noite', f:['Café da manhã','Próximo ao cais','Trilhas saindo da porta'], d:'Pousada simpática e bem avaliada no centro da Vila do Abraão. Equipe ajuda com trilhas e passeios de barco pela ilha.' },
      mid: { n:'Aruá Praia Hotel', st:4, nt:'9.0', b:'Abraão — beira-mar', p:'A partir de R$ 450/noite', f:['Frente ao mar','Piscina','Café da manhã especial','Deque beira d\'água'], d:'Hotel de alto padrão com vista direta para a Baía de Abraão e piscina integrada à paisagem natural da Ilha Grande.' },
      lux: { n:'Sítio Caraíva', st:4, nt:'9.3', b:'Ilha Grande — área exclusiva', p:'A partir de R$ 980/noite', f:['Acesso exclusivo','Praia privativa','Ecoturismo de luxo','Chef particular'], d:'Experiência de ecoturismo de luxo em área exclusiva da Ilha Grande, próximo à famosa Praia de Lopes Mendes. Chef particular e atendimento personalizado.' }
    },
    'angra-dos-reis': {
      t: 'Onde Ficar em Angra dos Reis',
      s: 'Centro de Angra para praticidade · Frade/Bracuí para resorts · Ilhas para experiência exclusiva',
      eco: { n:'Hotel London Palace Angra', st:3, nt:'8.1', b:'Centro de Angra dos Reis', p:'A partir de R$ 185/noite', f:['Café da manhã','Próximo às barcas','Estacionamento'], d:'Boa opção no centro de Angra, perto do terminal de barcas para a Ilha Grande e das excursões pelas ilhas.' },
      mid: { n:'Hotel do Frade Golf Resort', st:4, nt:'8.8', b:'Frade', p:'A partir de R$ 580/noite', f:['Golf course','Marina privativa','Praias particulares','Piscinas'], d:'Resort exclusivo com campo de golfe, marina e praias particulares em área de mata nativa preservada. Acesso de barco às melhores ilhas.' },
      lux: { n:'Fasano Angra dos Reis', st:5, nt:'9.5', b:'Costa Verde — Angra', p:'A partir de R$ 2.400/noite', f:['Marina própria','SPA Fasano','Gastronomia gourmet','Bangalôs privados'], d:'O resort mais exclusivo da Costa Verde, com marina, SPA, gastronomia premiada Fasano e bangalôs com acesso direto ao mar da Baía de Angra.' }
    },
    'sao-paulo': {
      t: 'Onde Ficar em São Paulo',
      s: 'Jardins e Itaim para sofisticação · Consolação para cultura · Higienópolis para charme e praticidade',
      eco: { n:'ibis SP Congonhas', st:3, nt:'8.0', b:'Santo André / Congonhas', p:'A partir de R$ 165/noite', f:['Wi-Fi grátis','Próximo ao aeroporto CGH','Metrô por perto'], d:'Ótimo custo-benefício para quem usa o Aeroporto de Congonhas. Acesso rápido à Paulista via metrô.' },
      mid: { n:'Mercure São Paulo Paulista', st:4, nt:'8.7', b:'Bela Vista — Av. Paulista', p:'A partir de R$ 380/noite', f:['A 5 min da Av. Paulista','Restaurante','Academia','Rooftop'], d:'Hotel bem localizado na Bela Vista, a 5 minutos a pé da Avenida Paulista e próximo ao MASP e Ibirapuera.' },
      lux: { n:'Hotel Unique São Paulo', st:5, nt:'9.4', b:'Jardim Paulista', p:'A partir de R$ 1.400/noite', f:['Design Ruy Ohtake','Rooftop bar Skye','SPA','Restaurante Seen'], d:'Ícone de design de São Paulo, com o famoso bar Skye no rooftop com vista 360° da cidade. O hotel mais desejado da capital paulista.' }
    },
    'ilhabela': {
      t: 'Onde Ficar em Ilhabela',
      s: 'Parte norte (Vila e Barra Velha) para conveniência · Leste da ilha para praias desertas',
      eco: { n:'Pousada Canto Bravo', st:3, nt:'8.3', b:'Vila de Ilhabela', p:'A partir de R$ 210/noite', f:['Piscina','Café da manhã','Vista para o canal'], d:'Pousada charmosa na Vila de Ilhabela com vista para o canal e fácil acesso às trilhas e praias da parte norte da ilha.' },
      mid: { n:'Dpny Beach Hotel & Spa', st:4, nt:'9.0', b:'Frente ao canal de São Sebastião', p:'A partir de R$ 680/noite', f:['Frente ao mar','SPA','Piscina','Gastronomia'], d:'Hotel de alto padrão frente ao Canal de São Sebastião, com SPA completo e restaurante de qualidade. Referência em Ilhabela.' },
      lux: { n:'Ilhabela Yacht Club Hotel', st:5, nt:'9.3', b:'Praia da Armação', p:'A partir de R$ 1.400/noite', f:['Marina privativa','SPA exclusivo','Velas e iates','Chef particular'], d:'O mais exclusivo de Ilhabela, com marina privativa, experiências náuticas premium e uma das melhores gastronomias do Litoral Norte de São Paulo.' }
    },
    'olimpia': {
      t: 'Onde Ficar em Olímpia',
      s: 'Fique próximo ao Thermas dos Laranjais — os melhores hotéis ficam no corredor da SP-310',
      eco: { n:'ibis Olímpia', st:3, nt:'8.1', b:'Próximo ao parque', p:'A partir de R$ 155/noite', f:['Café da manhã','Wi-Fi','Shuttle para o parque'], d:'Opção econômica bem avaliada próxima ao Thermas dos Laranjais, com shuttle disponível para o parque.' },
      mid: { n:'Tauá Grande Hotel Termas Olímpia', st:4, nt:'8.9', b:'Complexo do parque', p:'A partir de R$ 520/noite', f:['Termas privativas','Múltiplas piscinas quentes','All-inclusive disponível','Acesso direto ao parque'], d:'Resort de grande porte com termas próprias e acesso conectado ao Thermas dos Laranjais. Excelente para famílias.' },
      lux: { n:'Gran Marquise Resort Olímpia', st:5, nt:'9.2', b:'Complexo Thermas — VIP', p:'A partir de R$ 950/noite', f:['Área VIP do parque','SPA premium','Suítes temáticas','Gastronomia exclusiva'], d:'A hospedagem mais completa de Olímpia, com suítes temáticas, SPA premium e acesso VIP ao maior parque de águas termais da América Latina.' }
    },
    'belo-horizonte': {
      t: 'Onde Ficar em Belo Horizonte',
      s: 'Savassi e Lourdes para sofisticação · Centro para praticidade · Funcionários para os restaurantes',
      eco: { n:'ibis BH Savassi', st:3, nt:'8.2', b:'Savassi', p:'A partir de R$ 160/noite', f:['No coração da Savassi','Wi-Fi','Próximo ao metrô'], d:'Posição perfeita no bairro mais animado de BH — a 2 minutos dos melhores bares, restaurantes e vida noturna da Savassi.' },
      mid: { n:'Ouro Minas Palace Hotel', st:4, nt:'8.7', b:'Santa Efigênia', p:'A partir de R$ 350/noite', f:['Piscina','SPA','Centro de convenções','Restaurante mineiro'], d:'Hotel de referência em BH com excelente gastronomia mineira, SPA e ampla estrutura de lazer e negócios.' },
      lux: { n:'Mercure BH Lourdes', st:5, nt:'9.1', b:'Lourdes', p:'A partir de R$ 680/noite', f:['Bairro Lourdes premium','Rooftop','SPA','Gastronomia de autor'], d:'O hotel mais sofisticado de BH, no chique bairro Lourdes, com rooftop panorâmico, SPA e restaurante de gastronomia contemporânea mineira.' }
    },
    'ouro-preto': {
      t: 'Onde Ficar em Ouro Preto',
      s: 'Pilar (centro histórico) é a localização ideal — tudo a pé das igrejas barrocas e museus',
      eco: { n:'Pousada Nello Nuno', st:3, nt:'8.5', b:'Centro Histórico', p:'A partir de R$ 190/noite', f:['Vista para as igrejas','Café da manhã mineiro','A 5 min da Praça Tiradentes'], d:'Pousada histórica no centro de Ouro Preto com vista incrível para as igrejas barrocas e café da manhã com quitandas mineiras.' },
      mid: { n:'Grande Hotel Ouro Preto', st:4, nt:'8.9', b:'Centro — Rua das Flores', p:'A partir de R$ 380/noite', f:['Vista panorâmica','Piscina','Design Niemeyer','Restaurante'], d:'Hotel histórico projetado por Oscar Niemeyer com vista panorâmica de toda a cidade. Um ícone da arquitetura moderna no coração do barroco brasileiro.' },
      lux: { n:'Solar Nossa Senhora do Rosário', st:5, nt:'9.3', b:'Centro Histórico — casarão tombado', p:'A partir de R$ 750/noite', f:['Casarão colonial do séc. XVIII','SPA','Piscina aquecida','Gastronomia mineira premium'], d:'Hotel 5 estrelas em casarão colonial tombado do século XVIII, com SPA, piscina aquecida e a mais refinada experiência gastronômica mineira.' }
    },
    'capitolio': {
      t: 'Onde Ficar em Capitólio',
      s: 'Centro de Capitólio ou beira do Lago de Furnas — próximo às marinas para os cânions',
      eco: { n:'Pousada Serra Azul', st:3, nt:'8.3', b:'Centro de Capitólio', p:'A partir de R$ 185/noite', f:['Vista para o lago','Café da manhã','Próximo às marinas'], d:'Pousada bem avaliada em Capitólio, próxima às marinas de onde saem os passeios pelos cânions e piscinas naturais.' },
      mid: { n:'Recanto do Lago Resort', st:4, nt:'8.9', b:'Lago de Furnas', p:'A partir de R$ 420/noite', f:['Beira do lago','Deck privativo','Piscina','Passeios de barco'], d:'Resort à beira do Lago de Furnas com deck privativo, piscina e passeios de barco exclusivos pelos cânions de Capitólio.' },
      lux: { n:'Villa de Pedra Boutique Hotel', st:5, nt:'9.2', b:'Mirante dos Cânions', p:'A partir de R$ 850/noite', f:['Vista panorâmica dos cânions','SPA','Piscina de borda infinita','Gastronomia mineira'], d:'O hotel mais exclusivo de Capitólio, com piscina de borda infinita sobre os cânions, SPA sofisticado e gastronomia mineira de alto nível.' }
    },
    'foz-do-iguacu': {
      t: 'Onde Ficar em Foz do Iguaçu',
      s: 'Hotel das Cataratas (dentro do parque) é o ponto mais estratégico · Região das Cataratas para qualquer hotel',
      eco: { n:'Concept Design Hostel & Suites', st:3, nt:'8.4', b:'Centro de Foz', p:'A partir de R$ 160/noite', f:['Wi-Fi','Café da manhã','Transfer para as cataratas'], d:'Boa opção econômica no centro de Foz do Iguaçu, com transfer disponível para o Parque Nacional e a Itaipu.' },
      mid: { n:'Bourbon Cataratas Resort', st:4, nt:'8.9', b:'Região das Cataratas', p:'A partir de R$ 480/noite', f:['Próximo às cataratas','Piscinas','All-inclusive','Kids Club'], d:'Resort completo próximo às Cataratas com excelente estrutura de lazer, all-inclusive e localização estratégica para o Parque Nacional.' },
      lux: { n:'Belmond Hotel das Cataratas', st:5, nt:'9.8', b:'Dentro do Parque Nacional', p:'A partir de R$ 2.800/noite', f:['ÚNICO dentro do parque','Acesso exclusivo ao amanhecer','SPA','Piscina histórica'], d:'O hotel mais icônico do Brasil — o ÚNICO dentro do Parque Nacional das Cataratas. Acesso exclusivo às cataratas ao amanhecer e anoitecer, sem turistas.' }
    },
    'penedo-al': {
      t: 'Onde Ficar em Penedo',
      s: 'Centro Histórico de Penedo — tudo a pé das igrejas coloniais e do Rio São Francisco',
      eco: { n:'Pousada Colonial', st:3, nt:'8.2', b:'Centro Histórico de Penedo', p:'A partir de R$ 160/noite', f:['Vista para o São Francisco','Café da manhã','No centro histórico'], d:'Pousada simples e bem avaliada no centro histórico de Penedo, com vista para o Rio São Francisco.' },
      mid: { n:'Imperial Hotel Penedo', st:4, nt:'8.7', b:'Centro Histórico — beira-rio', p:'A partir de R$ 290/noite', f:['À beira do Rio São Francisco','Piscina','Restaurante regional','Vista panorâmica'], d:'O melhor hotel de Penedo, com piscina, restaurante de culinária regional alagoana e vista para o Rio São Francisco.' },
      lux: { n:'Pousada Forte da Rocheira', st:4, nt:'9.0', b:'Rocheira — beira do São Francisco', p:'A partir de R$ 480/noite', f:['Casarão histórico restaurado','Vista privilegiada do rio','Gastronomia regional','Personalizado'], d:'Instalada em casarão histórico restaurado com vista privilegiada sobre o São Francisco, oferece a experiência mais completa e autêntica de Penedo.' }
    },
    'florianopolis': {
      t: 'Onde Ficar em Florianópolis',
      s: 'Lagoa da Conceição para surf e balada · Jurerê Internacional para luxo · Ingleses para família',
      eco: { n:'ibis Florianópolis', st:3, nt:'8.1', b:'Centro / Continente', p:'A partir de R$ 175/noite', f:['Wi-Fi grátis','Café da manhã','Acesso à ilha via ponte'], d:'Boa opção no continente, bem conectado à ilha via ponte. Ponto de chegada prático para quem chega de ônibus ou carro.' },
      mid: { n:'Costa Norte Ingleses Hotel', st:4, nt:'8.8', b:'Praia dos Ingleses', p:'A partir de R$ 420/noite', f:['Próximo à praia','Piscina aquecida','Restaurante','Kids Club'], d:'Hotel bem estruturado na Praia dos Ingleses, uma das praias mais populares e tranquilas de Floripa. Ótimo para famílias.' },
      lux: { n:'Jurerê Beach Village', st:5, nt:'9.4', b:'Jurerê Internacional', p:'A partir de R$ 1.800/noite', f:['Frente ao mar de Jurerê','SPA','Club exclusivo','Gastronomia premiada'], d:'O resort mais exclusivo de Florianópolis, em Jurerê Internacional — o bairro mais sofisticado do Brasil. Frente ao mar e o mais alto padrão de serviço.' }
    },
    'gramado': {
      t: 'Onde Ficar em Gramado',
      s: 'Rua Coberta e Centro para tudo a pé · Avenida das Hortênsias para hotéis de charme',
      eco: { n:'Hotel Ritta Höppner', st:3, nt:'8.5', b:'Centro de Gramado', p:'A partir de R$ 250/noite', f:['No centro','Café colonial','Lareira nos quartos'], d:'Hotel clássico no centro de Gramado com café colonial farto e atmosfera acolhedora. Tudo a pé da Rua Coberta.' },
      mid: { n:'Kurotel Longevity Medical Center & Spa', st:4, nt:'9.0', b:'Gramado — área verde', p:'A partir de R$ 720/noite', f:['SPA premiado','Programas de saúde','Gastronomia saudável','Natureza preservada'], d:'Um dos melhores spas da América Latina, com programas de longevidade e bem-estar únicos no Brasil, em área verde preservada.' },
      lux: { n:'Serra Azul Hotel', st:5, nt:'9.5', b:'Av. das Hortênsias', p:'A partir de R$ 1.200/noite', f:['Piscina aquecida coberta','SPA completo','Gastronomia italiana','Lareira em todos os quartos'], d:'O mais luxuoso de Gramado, com arquitetura europeia impecável, SPA premium, gastronomia italiana de autor e lareira em todos os quartos.' }
    },
    'serra-gaucha': {
      t: 'Onde Ficar na Serra Gaúcha',
      s: 'Bento Gonçalves para vinho · Garibaldi para espumante · Canela como base alternativa a Gramado',
      eco: { n:'Pousada Caminhos de Pedra', st:3, nt:'8.3', b:'Bento Gonçalves', p:'A partir de R$ 220/noite', f:['Vista para os vinhedos','Café colonial','Enoturismo próximo'], d:'Pousada charmosa em Bento Gonçalves com vista para os vinhedos. Ponto de partida perfeito para o enoturismo da Serra.' },
      mid: { n:'Vino Hotel', st:4, nt:'9.0', b:'Vale dos Vinhedos', p:'A partir de R$ 580/noite', f:['Dentro do Vale dos Vinhedos','Adega própria','SPA','Gastronomia italiana'], d:'Hotel boutique dentro do Vale dos Vinhedos com adega própria, degustações exclusivas e gastronomia italiana de autor.' },
      lux: { n:'Dal Pizzol Hotel', st:5, nt:'9.4', b:'Vale dos Vinhedos — Faria Lemos', p:'A partir de R$ 1.400/noite', f:['Vinícola integrada','Cave privativa','Spa com aromaterapia de vinho','Chef exclusivo'], d:'A experiência de enoturismo de luxo mais completa da Serra Gaúcha, com vinícola própria, cave privativa e tratamentos de spa com vinho.' }
    },
    'curitiba': {
      t: 'Onde Ficar em Curitiba',
      s: 'Batel e Bairro Alto para sofisticação · Centro para praticidade · Rebouças próximo ao Jardim Botânico',
      eco: { n:'ibis Curitiba Aeroporto', st:3, nt:'8.0', b:'São José dos Pinhais', p:'A partir de R$ 150/noite', f:['Wi-Fi','Próximo ao aeroporto','Shuttle disponível'], d:'Opção prática para quem tem voos cedo ou tarde. Shuttle para o aeroporto e bom custo-benefício.' },
      mid: { n:'Radisson Hotel Curitiba', st:4, nt:'8.8', b:'Centro Cívico', p:'A partir de R$ 380/noite', f:['Localização central','Piscina aquecida','Restaurante gourmet','Academia'], d:'Um dos melhores 4 estrelas de Curitiba, bem localizado no Centro Cívico com piscina aquecida e restaurante de qualidade.' },
      lux: { n:'Hotel Unique Garden Curitiba', st:5, nt:'9.2', b:'Batel', p:'A partir de R$ 850/noite', f:['Bairro Batel premium','SPA','Gastronomia contemporânea','Rooftop'], d:'O hotel mais sofisticado de Curitiba no chique bairro Batel, com SPA, gastronomia de alto nível e rooftop com vista para a cidade.' }
    },
    'caldas-novas': {
      t: 'Onde Ficar em Caldas Novas',
      s: 'Parque das Fontes Quentes é o epicentro — os melhores resorts têm termas próprias',
      eco: { n:'ibis Caldas Novas', st:3, nt:'8.0', b:'Centro de Caldas Novas', p:'A partir de R$ 155/noite', f:['Wi-Fi','Café da manhã','Acesso a parques próximos'], d:'Opção econômica no centro de Caldas Novas. Para as termas, os parques públicos da Lagoa Quente ficam a poucos minutos.' },
      mid: { n:'Lacqua Diroma Resort', st:4, nt:'8.9', b:'Complexo Diroma', p:'A partir de R$ 580/noite', f:['Maior parque aquático da AL','All-inclusive','Piscinas termais cobertas','Shows noturnos'], d:'Resort com o maior parque aquático da América Latina, all-inclusive e entretenimento noturno. Diversão total para toda a família.' },
      lux: { n:'Privê Riviera Resort', st:5, nt:'9.1', b:'Região das Fontes Quentes', p:'A partir de R$ 1.100/noite', f:['Termas privativas na suíte','SPA termal','Gastronomia exclusiva','Hidromassagem privativa'], d:'O resort mais luxuoso de Caldas Novas, com termas privativas nas suítes, SPA termal e a mais alta gastronomia goiana.' }
    },
    'chapada-dos-guimaraes': {
      t: 'Onde Ficar na Chapada dos Guimarães',
      s: 'Vila de Chapada dos Guimarães (centro) é a base ideal — acesso ao Véu de Noiva e Cidade de Pedra',
      eco: { n:'Pousada do Parque', st:3, nt:'8.4', b:'Centro da Vila', p:'A partir de R$ 175/noite', f:['Café da manhã regional','Apoio com trilhas','Piscina'], d:'Pousada bem avaliada no centro da vila, com equipe que auxilia na contratação de guias e planejamento das trilhas.' },
      mid: { n:'Hotel Penhasco', st:4, nt:'9.0', b:'Penhasco — acima da chapada', p:'A partir de R$ 420/noite', f:['Vista panorâmica da chapada','Piscina de borda infinita','Restaurante regional'], d:'Hotel com a mais incrível vista panorâmica da Chapada dos Guimarães, piscina de borda infinita e gastronomia mato-grossense.' },
      lux: { n:'Mata Nativa Boutique Hotel', st:5, nt:'9.3', b:'Área rural preservada', p:'A partir de R$ 850/noite', f:['Bangalôs no cerrado','SPA com ervas do cerrado','Chef local','Trilhas privativas'], d:'Boutique hotel de luxo em área de cerrado preservado, com bangalôs exclusivos, SPA com ingredientes do cerrado e trilhas particulares.' }
    },
    'chapada-dos-veadeiros': {
      t: 'Onde Ficar na Chapada dos Veadeiros',
      s: 'Alto Paraíso de Goiás é a base principal · São Jorge para estar dentro do parque',
      eco: { n:'Pousada Casa Rosa', st:3, nt:'8.5', b:'Alto Paraíso de Goiás', p:'A partir de R$ 170/noite', f:['Café da manhã orgânico','Piscina','Guias recomendados'], d:'Pousada aconchegante em Alto Paraíso com excelente café da manhã orgânico e equipe que conhece todas as trilhas da Chapada.' },
      mid: { n:'Pousada Villa Serrano', st:4, nt:'9.1', b:'Alto Paraíso — cerrado', p:'A partir de R$ 480/noite', f:['Bangalôs no cerrado','Piscina natural','Spa com cristais','Gastronomia vegana'], d:'Pousada boutique com bangalôs integrados ao cerrado, piscina natural, spa holístico e gastronomia vegana sofisticada.' },
      lux: { n:'Rancho Bona Vista', st:4, nt:'9.4', b:'São Jorge — área do parque', p:'A partir de R$ 1.200/noite', f:['Dentro do parque','Piscina natural com cachoeira','Chef exclusivo','Vista para o vale'], d:'Experiência exclusiva na área de influência do Parque Nacional, com piscina natural junto a cachoeira, chef particular e vista deslumbrante.' }
    },
    'pantanal': {
      t: 'Onde Ficar no Pantanal',
      s: 'Lodges dentro do Pantanal são a melhor escolha — quanto mais adentro, mais fauna você encontra',
      eco: { n:'Pousada Xaraés', st:3, nt:'8.5', b:'Corumbá — entrada do Pantanal', p:'A partir de R$ 280/noite', f:['Safári de barco','Guia credenciado','Café da manhã pantaneiro'], d:'Pousada bem avaliada nas bordas do Pantanal Sul, com safáris de barco pelo Rio Paraguai e guias especializados em fauna.' },
      mid: { n:'Pousada Pantanal Norte', st:4, nt:'9.0', b:'Barão de Melgaço — Pantanal Norte', p:'A partir de R$ 680/noite', f:['Dentro do Pantanal','Safari fotográfico','Canoagem','Observação de onças'], d:'Lodge dentro do Pantanal Norte com excelente avistamento de fauna, safáris fotográficos e guias biólogos especializados.' },
      lux: { n:'Araras Eco Lodge', st:5, nt:'9.7', b:'Pantanal Norte — Poconé', p:'A partir de R$ 2.400/noite', f:['Avistamento garantido de onças','Guias biólogos','Gastronomia regional','Torres de observação'], d:'Eleito o melhor ecolodge do Pantanal, com índice de avistamento de onças pintadas acima de 90%, guias especialistas e gastronomia pantaneira premiada.' }
    },
    'alter-do-chao': {
      t: 'Onde Ficar em Alter do Chão',
      s: 'Frente ao Lago Verde ou à Praia do Amor — localização central na vila para tudo a pé',
      eco: { n:'Pousada Vila Alter', st:3, nt:'8.3', b:'Centro de Alter do Chão', p:'A partir de R$ 180/noite', f:['Piscina','Café da manhã amazônico','Translados disponíveis'], d:'Pousada simpática no centro de Alter do Chão, próxima ao Lago Verde e à orla onde ficam os flutuantes e bares.' },
      mid: { n:'Beloalter Hotel', st:4, nt:'8.9', b:'Frente ao Lago Verde', p:'A partir de R$ 380/noite', f:['Vista para o Lago Verde','Piscina','Restaurante amazônico','Passeios de canoa'], d:'O melhor hotel de Alter do Chão, com vista direta para o Lago Verde, restaurante amazônico e passeios de canoa organizados.' },
      lux: { n:'Amazon Village Jungle Lodge', st:5, nt:'9.3', b:'Floresta amazônica — Rio Tapajós', p:'A partir de R$ 1.400/noite', f:['Bangalôs sobre o rio','Trilhas na floresta','Chef amazônico','Experiência imersiva'], d:'Lodge de luxo dentro da floresta amazônica com bangalôs sobre o Rio Tapajós, trilhas com guias indígenas e gastronomia amazônica de autor.' }
    },
    'amazonia': {
      t: 'Onde Ficar na Amazônia',
      s: 'Manaus como base logística · Lodges no Rio Negro para imersão total na floresta',
      eco: { n:'ibis Manaus', st:3, nt:'8.1', b:'Centro de Manaus', p:'A partir de R$ 165/noite', f:['Wi-Fi','Próximo ao Teatro Amazonas','Piscina'], d:'Boa opção no centro de Manaus, perto do icônico Teatro Amazonas e do Mercado Adolpho Lisboa.' },
      mid: { n:'Tropical Manaus Ecoresort', st:4, nt:'8.7', b:'Ponta Negra — Rio Negro', p:'A partir de R$ 480/noite', f:['Beira do Rio Negro','Piscina olímpica','Parque de animais','Passeios ao encontro das águas'], d:'Resort histórico à beira do Rio Negro com estrutura completa, parque de animais amazônicos e passeios ao encontro das águas.' },
      lux: { n:'Amazon Tupana Lodge', st:5, nt:'9.5', b:'Rio Negro — Novo Airão (selva)', p:'A partir de R$ 3.200/noite', f:['Dentro da floresta','Avistamento de uirapuru','Nado com botos','Guias indígenas'], d:'Ecolodge de altíssimo padrão dentro da floresta amazônica. Nado com botos cor-de-rosa, caminhadas noturnas e observação de pássaros raros.' }
    },
    'jalapao': {
      t: 'Onde Ficar no Jalapão',
      s: 'Mateiros é a base dentro do parque · Ponte Alta do Tocantins para logística',
      eco: { n:'Pousada das Pedras', st:3, nt:'8.4', b:'Mateiros — Jalapão', p:'A partir de R$ 240/noite', f:['Café da manhã sertanejo','Guias locais','Estrutura confortável'], d:'A melhor opção econômica dentro de Mateiros, ponto de partida ideal para os Fervedouros, Cachoeira da Velha e dunas do Jalapão.' },
      mid: { n:'Pousada Jalapão Eco Resort', st:4, nt:'9.0', b:'Mateiros — área do parque', p:'A partir de R$ 580/noite', f:['Bangalôs na caatinga','Piscina','Pacotes de trilhas','Gastronomia do cerrado'], d:'Eco resort bem estruturado em Mateiros com bangalôs confortáveis no cerrado e pacotes completos de trilhas com guias experientes.' },
      lux: { n:'Jalapão Exclusive Camp', st:5, nt:'9.5', b:'Fervedouros do Jalapão', p:'A partir de R$ 2.200/noite', f:['Glamping de luxo nas dunas','Acesso exclusivo aos fervedouros','Chef particular','Helicóptero disponível'], d:'Experiência de glamping de luxo nas dunas douradas do Jalapão, com acesso privativo aos fervedouros, chef particular e possibilidade de translado de helicóptero.' }
    }
  };

  /* ── RENDER ── */
  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function feats(arr) {
    return arr.map(function(f){ return '<span class="hr-feat">✓ ' + f + '</span>'; }).join('');
  }

  function card(h, tier, href) {
    var labels = { eco: '💚 Econômico', mid: '🔵 Conforto', lux: '⭐ Viagem Completa' };
    return [
      '<div class="hr-panel' + (tier === 'eco' ? ' on' : '') + '" id="hr-' + tier + '">',
      '  <div class="hr-card ' + tier + '">',
      '    <div class="hr-card-top">',
      '      <div>',
      '        <span class="hr-badge ' + tier + '">' + labels[tier] + '</span>',
      '        <div class="hr-name">' + h.n + '</div>',
      '        <div class="hr-loc">📍 ' + h.b + '</div>',
      '      </div>',
      '      <div class="hr-right">',
      '        <div class="hr-stars">' + stars(h.st) + '</div>',
      '        <div class="hr-nota">⭐ ' + h.nt + '/10</div>',
      '      </div>',
      '    </div>',
      '    <p class="hr-desc">' + h.d + '</p>',
      '    <div class="hr-feats">' + feats(h.f) + '</div>',
      '    <div class="hr-footer">',
      '      <div class="hr-price">' + h.p + '<small>Preços estimados · confirme disponibilidade</small></div>',
      '      <a class="hr-btn" href="' + href + '" target="_blank" rel="sponsored noopener">Ver no Trivago →</a>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  function buildSection(data, href) {
    return [
      '<div class="hr-section" id="hoteis-recomendados">',
      '  <div class="hr-title-wrap">',
      '    <h2 class="hr-h2">🏨 ' + data.t + '</h2>',
      '    <p class="hr-sub">' + data.s + '</p>',
      '  </div>',
      '  <div class="hr-tabs" role="tablist">',
      '    <button class="hr-tab eco-on" onclick="hrSwitch(\'eco\',this)">💚 Econômico</button>',
      '    <button class="hr-tab" onclick="hrSwitch(\'mid\',this)">🔵 Conforto</button>',
      '    <button class="hr-tab" onclick="hrSwitch(\'lux\',this)">⭐ Viagem Completa</button>',
      '  </div>',
      card(data.eco, 'eco', href),
      card(data.mid, 'mid', href),
      card(data.lux, 'lux', href),
      '</div>'
    ].join('\n');
  }

  /* ── TAB SWITCH ── */
  window.hrSwitch = function(tier, btn) {
    var section = btn.closest('.hr-section');
    section.querySelectorAll('.hr-panel').forEach(function(p){ p.classList.remove('on'); });
    section.querySelector('#hr-' + tier).classList.add('on');
    var tabs = section.querySelectorAll('.hr-tab');
    tabs.forEach(function(t){ t.className = 'hr-tab'; });
    btn.classList.add({ eco: 'eco-on', mid: 'mid-on', lux: 'lux-on' }[tier]);
  };

  /* ── INJECT ── */
  function inject() {
    // Detecta chave pelo pathname
    var path = window.location.pathname;
    var key = path.replace(/^\//, '').replace(/\.html$/, '');
    var data = DATA[key];
    if (!data) return;

    // CSS
    if (!document.getElementById('hr-css')) {
      var s = document.createElement('style');
      s.id = 'hr-css';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    // Evita duplicata
    if (document.getElementById('hoteis-recomendados')) return;

    // Pega link Trivago da página
    var trivago = 'https://www.trivago.com.br';
    var links = document.querySelectorAll('a[href*="tidd.ly"], a[href*="trivago"]');
    if (links.length) trivago = links[links.length - 1].href;

    // Cria o container
    var wrapper = document.createElement('div');
    wrapper.innerHTML = buildSection(data, trivago);
    var frag = wrapper.firstElementChild;

    // Injeta antes do .hoteis-cta
    var target = document.querySelector('.hoteis-cta');
    if (target) {
      target.parentNode.insertBefore(frag, target);
    } else {
      // fallback: antes do footer
      var footer = document.querySelector('footer');
      if (footer) footer.parentNode.insertBefore(frag, footer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
