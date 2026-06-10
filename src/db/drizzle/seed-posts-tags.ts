import Database from 'better-sqlite3';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

const db = new Database(resolve(process.cwd(), 'db.sqlite3'));

function slug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function upsertTag(name: string): string {
  const s = slug(name);
  const existing = db.prepare('SELECT id FROM tags WHERE slug = ?').get(s) as { id: string } | undefined;
  if (existing) return existing.id;
  const id = randomUUID();
  db.prepare('INSERT INTO tags (id, name, slug, created_at) VALUES (?, ?, ?, ?)').run(id, name, s, new Date().toISOString());
  return id;
}

function insertPost(data: {
  title: string;
  author: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
}) {
  const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug(data.title));
  if (existing) {
    console.log(`Já existe: ${data.title}`);
    return;
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const postSlug = slug(data.title);

  db.prepare(`
    INSERT INTO posts (id, slug, title, author, excerpt, content, cover_image_url, published, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(id, postSlug, data.title, data.author, data.excerpt, data.content, data.coverImageUrl, now, now);

  for (const tagName of data.tags) {
    const tagId = upsertTag(tagName);
    db.prepare('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)').run(id, tagId);
  }

  console.log(`Criado: ${data.title} [${data.tags.join(', ')}]`);
}

// ─── POSTS ORIGINAIS ───────────────────────────────────────────────────────────

insertPost({
  title: 'O segredo das cozinhas de vó: como receitas viram memória afetiva',
  author: 'Marina Calixto',
  excerpt: 'Existe um ponto onde tempero e lembrança se misturam. Entender esse fenômeno pode transformar a sua relação com a cozinha.',
  tags: ['Gastronomia', 'Cultura', 'Bem-estar'],
  coverImageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  content: `
<h2>Quando comer é lembrar</h2>
<p>Toda família tem aquele prato que pausa o tempo. Pode ser um caldo que aparece só no inverno, um bolo que perfuma a casa inteira ou uma mistura simples de arroz que, por alguma razão, no prato de mais ninguém tem o mesmo gosto. Não é magia — é neurociência e afeto trabalhando juntos.</p>
<p>O olfato é o único sentido conectado diretamente ao sistema límbico, a região do cérebro responsável pelas emoções e pela memória de longa duração. Um cheiro pode ativar uma lembrança com muito mais precisão do que uma foto. E na cozinha, cheiro e sabor caminham lado a lado.</p>
<h2>A receita não é só ingredientes</h2>
<p>Quando tentamos reproduzir um prato de infância, raramente acertamos na primeira tentativa. Não é falta de habilidade. É que a receita carrega variáveis que não estão escritas em lugar nenhum: a panela velha de fundo grosso, o fogão a lenha que distribuía o calor de forma desigual, o horário da tarde com luz específica entrando pela janela.</p>
<p>Reconstituir uma receita afetiva é um trabalho arqueológico. Você escava memórias junto com temperos. Às vezes o que falta é uma pitada de tempo passado juntos — e esse ingrediente não tem substituto.</p>
<h2>Como preservar essas receitas antes que se percam</h2>
<p>Uma prática que tem ganhado espaço é o que chamo de <strong>entrevista culinária</strong>: sentar com um familiar mais velho, cozinhar junto e filmar o processo. Não só os ingredientes, mas os gestos, as medidas feitas na palma da mão, o ponto avaliado no olhar. Esse vídeo vale mais do que qualquer caderno de receitas.</p>
<p>A cozinha de vó não é um museu. É um laboratório vivo de identidade familiar. Enquanto existe alguém para transmitir, existe a chance de preservar. Depois, só resta reinventar com o que ficou na memória — e isso tem beleza própria também.</p>
  `.trim(),
});

insertPost({
  title: 'Trilhas urbanas: como descobrir sua cidade caminhando',
  author: 'Felipe Drummond',
  excerpt: 'Você não precisa sair da cidade para encontrar natureza, história e perspectiva. Às vezes, basta mudar o caminho que você usa todo dia.',
  tags: ['Esporte', 'Natureza', 'Bem-estar'],
  coverImageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
  content: `
<h2>A cidade que você ainda não viu</h2>
<p>A maioria das pessoas conhece sua cidade de dentro de um carro, um ônibus ou olhando para uma tela de celular enquanto anda. Caminhar de propósito — com atenção, sem pressa e sem destino fixo — transforma completamente a relação com o espaço urbano.</p>
<p>Não é preciso ter trilhas marcadas, parques enormes ou equipamentos especiais. Uma calçada de bairro antigo, um córrego que atravessa a cidade, um morro com vista que todo mundo conhece mas ninguém sobe — tudo isso pode ser o início de uma exploração genuína.</p>
<h2>Como montar a sua própria trilha urbana</h2>
<p>O primeiro passo é escolher um tema. Pode ser arquitetônico (construções de determinada época), natural (árvores centenárias, nascentes urbanas), histórico (locais de eventos que marcaram a cidade) ou completamente aleatório. O tema cria um fio condutor que transforma a caminhada em narrativa.</p>
<p>Depois, defina uma distância razoável para o seu condicionamento atual. Cinco quilômetros em terreno plano é um bom começo. Com o tempo, você vai querer mais. Leve água, use calçado adequado e avise alguém onde vai — mesmo que seja pela cidade.</p>
<h2>O que você encontra quando para de correr</h2>
<p>Caminhar devagar revela o que a pressa esconde: o azulejo descascado de uma fachada que conta cem anos de história, o jardim improvisado numa grade de ferro por alguém que nunca vai ter quintal, o gato que dorme num beiral como se o mundo pertencesse a ele.</p>
<p>Essas pequenas descobertas têm um efeito acumulativo surpreendente no humor e na criatividade. Pesquisas em psicologia ambiental mostram que ambientes com variedade visual — irregularidades, texturas, elementos naturais — reduzem o estresse cognitivo de forma comparável a caminhadas em áreas naturais.</p>
<p>Sua cidade é maior do que o trajeto que você repete todo dia. Ela espera ser vista de outro ângulo.</p>
  `.trim(),
});

insertPost({
  title: 'Aprender violão depois dos 30: o que muda e o que fica igual',
  author: 'Renata Silvério',
  excerpt: 'A ideia de que adultos aprendem instrumentos mais devagar é mais mito do que realidade. O que muda é a abordagem — e isso pode ser uma vantagem.',
  tags: ['Música', 'Educação', 'Desenvolvimento pessoal'],
  coverImageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
  content: `
<h2>O cérebro adulto e a música</h2>
<p>Durante décadas, acreditou-se que aprender um instrumento musical era uma janela que se fechava cedo — se você não começasse na infância, estaria perdido. A neurociência moderna derrubou essa ideia com bastante elegância. O cérebro adulto mantém plasticidade significativa a vida toda, especialmente quando estimulado por atividades que combinam coordenação motora, raciocínio e emoção — exatamente o que um instrumento musical faz.</p>
<p>O que muda não é a capacidade, mas a bagagem. Crianças aprendem por absorção e repetição sem questionar. Adultos precisam entender o porquê das coisas para consolidar o aprendizado. Isso significa que um bom método para adultos precisa ser explicativo, não apenas instrutivo.</p>
<h2>Os primeiros três meses são os mais importantes</h2>
<p>A maior parte das pessoas que desiste de aprender violão abandona nos primeiros noventa dias — antes das pontas dos dedos ficarem calejadas, antes dos acordes soarem limpos, antes de conseguir tocar qualquer coisa que pareça música de verdade.</p>
<p>Atravessar esse período exige uma estratégia simples: tocar todos os dias, mesmo que por dez minutos. A consistência supera a intensidade. Uma hora por semana produz resultado pior do que dez minutos diários, porque o motor da plasticidade cerebral é a frequência de ativação, não a duração de cada sessão.</p>
<h2>Escolha músicas que você ama desde o primeiro dia</h2>
<p>Escadas, arpejos e exercícios técnicos são necessários, mas não precisam ser a única coisa que você toca. Desde a primeira semana, aprenda algo — mesmo que seja um fragmento de 4 compassos — de uma música que você genuinamente ama. Isso cria uma âncora emocional que sustenta a prática nos dias em que a motivação some.</p>
<p>Aprender violão depois dos 30 não é apesar da idade, é também por causa dela: você tem mais paciência, sabe o que quer tocar e consegue perceber sua própria evolução com clareza. Isso tem um valor que nenhuma criança impaciente pode apreciar.</p>
  `.trim(),
});

insertPost({
  title: 'Finanças pessoais: o erro que quase todo mundo comete no primeiro salário',
  author: 'Bruno Carvalhais',
  excerpt: 'Não é falta de dinheiro o que coloca a maioria das pessoas em dificuldade financeira. É a ausência de um sistema simples de organização.',
  tags: ['Finanças', 'Educação', 'Desenvolvimento pessoal'],
  coverImageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  content: `
<h2>O primeiro salário e a ilusão da abundância</h2>
<p>Quando o primeiro salário cai na conta, a sensação é de que o dinheiro nunca vai acabar. Ele sempre acaba. O problema não é necessariamente o valor — é que sem um sistema de gestão, qualquer quantia desaparece antes do fim do mês, deixando uma pergunta sem resposta: para onde foi?</p>
<p>O erro mais comum não é gastar demais com coisas supérfluas. É gastar de forma invisível — pequenas despesas diárias que individualmente parecem inofensivas, mas coletivamente somam uma parcela significativa da renda.</p>
<h2>O método dos três destinos</h2>
<p>Existe uma regra simples que funciona independentemente do salário: assim que o dinheiro entrar, divida-o imediatamente em três destinos antes de gastar qualquer coisa. O primeiro destino é a reserva — um percentual fixo que vai para uma conta separada e não pode ser tocado. O segundo são os gastos fixos obrigatórios (moradia, transporte, alimentação básica). O terceiro é o que sobra para tudo o mais.</p>
<p>A porcentagem exata de cada destino depende da sua realidade, mas o princípio é inegociável: a reserva vem primeiro, não depois. Guardar o que sobra ao final do mês é uma estratégia que nunca funciona, porque o mês sempre consome o que você deixar disponível.</p>
<h2>Por que uma reserva de emergência muda tudo</h2>
<p>Ter três a seis meses de despesas básicas guardadas em uma aplicação de fácil acesso não é riqueza — é estabilidade psicológica. A maioria dos ciclos de endividamento começa com uma emergência pequena que, por falta de reserva, precisa ser coberta com crédito caro.</p>
<p>Construir essa reserva é lento e às vezes frustrante. Mas existe uma linha invisível que você cruza quando ela está formada: as decisões financeiras param de ser tomadas com ansiedade e começam a ser tomadas com clareza. Essa mudança de qualidade de vida não tem preço.</p>
  `.trim(),
});

insertPost({
  title: 'Fotografia com celular: técnica simples que transforma fotos comuns',
  author: 'Larissa Fontes',
  excerpt: 'A câmera mais cara é a que você tem no bolso. O que separa uma foto boa de uma foto esquecível raramente é o equipamento.',
  tags: ['Tecnologia', 'Arte', 'Criatividade'],
  coverImageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800',
  content: `
<h2>A democratização da imagem</h2>
<p>Nunca na história tanta gente teve acesso a uma câmera de boa qualidade como hoje. O sensor de qualquer smartphone atual captura imagens com qualidade que seria impensável em equipamentos profissionais de dez anos atrás. Mesmo assim, a maioria das fotos tiradas todos os dias é tecnicamente boa e visualmente esquecível.</p>
<p>A diferença não está no hardware. Está em três princípios que qualquer pessoa pode aprender em uma tarde: luz, composição e intenção.</p>
<h2>Luz: o ingrediente que você não compra</h2>
<p>A câmera do celular interpreta a luz de forma automática, mas inteligente. O que ela não faz é escolher de onde vem a luz. Fotografar com a fonte de luz atrás do assunto gera silhueta ou foto subexposta. Com a luz lateral, surgem texturas e profundidade. Com a luz difusa de um dia nublado, as sombras desaparecem e os detalhes ficam uniformes.</p>
<p>A melhor luz natural para retratos e objetos é a chamada luz da hora dourada — os primeiros e últimos 40 minutos de luz solar do dia. É quente, baixa e suave. Nenhum filtro reproduz isso com a mesma qualidade.</p>
<h2>Composição: o que você exclui da foto</h2>
<p>A maioria das pessoas fotografa tudo que está à frente. Fotógrafos pensam no que remover do quadro. A regra dos terços — dividir o enquadramento em uma grade imaginária de 3×3 e posicionar o assunto nas interseções, não no centro — é um ponto de partida, não uma lei. Mas ela existe porque o olho humano lê imagens assimétricas com mais interesse do que imagens centralizadas.</p>
<p>Um exercício útil: antes de apertar o botão, pergunte-se o que nessa foto não precisa estar aqui. Dê um passo para o lado, agache, suba em algo. A perspectiva muda o que a câmera vê — e muda completamente o impacto da imagem.</p>
  `.trim(),
});

insertPost({
  title: 'Xadrez: o jogo que ensina a pensar antes de agir',
  author: 'Diego Moreira',
  excerpt: 'Aprender xadrez não é aprender a vencer adversários. É aprender a reconhecer padrões, aceitar erros e planejar com o que você tem.',
  tags: ['Esporte', 'Educação', 'Desenvolvimento pessoal'],
  coverImageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
  content: `
<h2>Por que o xadrez é diferente de outros jogos</h2>
<p>Em quase todos os jogos competitivos, existe algum elemento de sorte — uma carta que você não escolheu, um dado que rola, um tempo que não colabora. No xadrez, não existe sorte. Cada posição no tabuleiro é resultado exclusivo das decisões de ambos os jogadores. Isso o torna um espelho: ele mostra exatamente como você pensa.</p>
<p>Jogadores impulsivos tomam decisões rápidas sem calcular as consequências. Jogadores ansiosos respondem imediatamente a cada ameaça sem olhar para o quadro geral. Jogadores estratégicos aprendem a identificar o problema mais importante do momento e resolvê-lo primeiro.</p>
<h2>O que o xadrez ensina que vai além do tabuleiro</h2>
<p>A habilidade mais valiosa que o jogo desenvolve não é memorizar aberturas ou finais. É a capacidade de reconhecer quando você está perdendo e adaptar o plano. No xadrez, uma posição difícil raramente significa derrota imediata — significa que você precisa ser mais criativo, mais defensivo ou aceitar uma troca desfavorável para limitar o dano.</p>
<p>Esse raciocínio se traduz diretamente em situações cotidianas: negociações que não saem como o planejado, projetos que enfrentam obstáculos inesperados, relacionamentos que exigem recuo estratégico. O hábito de procurar a melhor jogada disponível — não a jogada ideal imaginária — é uma das mentalidades mais práticas que um jogo pode construir.</p>
<h2>Como começar sem sentir que está perdido</h2>
<p>O maior obstáculo para iniciantes é a sensação de que existem infinitas possibilidades e eles não conhecem nenhuma. A verdade é que nos primeiros jogos, apenas três princípios já colocam você à frente de 80% dos principiantes: controlar o centro do tabuleiro, desenvolver as peças antes de atacar e manter o rei protegido.</p>
<p>Ferramentas online tornaram o aprendizado acessível e gratuito. Jogar partidas curtas (5 a 10 minutos) e revisar os erros com a análise do computador depois é um ciclo de aprendizado eficiente e satisfatório, mesmo para quem nunca tocou em um tabuleiro.</p>
  `.trim(),
});

insertPost({
  title: 'Jardinagem em apartamento: como ter plantas sem quintal',
  author: 'Sofia Prates',
  excerpt: 'Morar em apartamento não é desculpa para viver sem verde. Com as escolhas certas de espécies e recipientes, qualquer espaço pode ter vida.',
  tags: ['Natureza', 'Bem-estar', 'Criatividade'],
  coverImageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
  content: `
<h2>Por que plantas transformam o ambiente</h2>
<p>Não é romantismo — é fisiologia. A presença de plantas em ambientes fechados está associada à redução de cortisol (o hormônio do estresse), melhora na umidade do ar e aumento na sensação subjetiva de bem-estar. Para quem trabalha em casa, elas também funcionam como marcadores visuais que ajudam a separar mentalmente espaço de trabalho de espaço de descanso.</p>
<p>Além disso, cuidar de algo vivo cria uma rotina de atenção que tem efeitos similares à meditação: você para, observa, age com cuidado e vê resultados ao longo do tempo.</p>
<h2>Espécies que funcionam de verdade em ambientes fechados</h2>
<p>O erro mais comum é escolher plantas pela aparência sem considerar as condições do apartamento. Luz é o fator mais crítico. Em ambientes com pouca entrada de luz natural, as melhores opções são as zamioculcas, pothos e samambaias-de-sombra — todas com tolerância alta à luminosidade reduzida e relativa resistência ao esquecimento na rega.</p>
<p>Para varandas e janelas com sol direto, suculentas e cactos são escolhas inteligentes: exigem pouca água, crescem devagar e raramente criam problemas. Ervas aromáticas como manjericão, alecrim e hortelã funcionam bem em janelas voltadas para o norte ou leste, onde o sol é mais suave.</p>
<h2>Rega: o equilíbrio entre negligência e excesso</h2>
<p>A maioria das plantas de apartamento morre de excesso de água, não de falta. A regra prática mais confiável é verificar o substrato antes de regar: enfie o dedo dois centímetros na terra. Se estiver úmido, espere. Se estiver seco, regue.</p>
<p>Criar um micro-jardim em apartamento é um projeto que começa pequeno — uma planta, um vaso, uma janela — e cresce junto com a confiança. O aprendizado acontece observando, errando e ajustando. E a satisfação de ver algo vivo prosperar num espaço que você criou não tem equivalente em decoração comprada.</p>
  `.trim(),
});

insertPost({
  title: 'Como assistir cinema de forma ativa: o que muda quando você presta atenção',
  author: 'Camila Verdi',
  excerpt: 'Existe uma diferença enorme entre passar duas horas olhando para uma tela e realmente ver um filme. Essa diferença é uma habilidade — e pode ser desenvolvida.',
  tags: ['Cinema', 'Cultura', 'Arte'],
  coverImageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800',
  content: `
<h2>O que significa ver um filme ativamente</h2>
<p>A maioria das pessoas usa o cinema como fundo de sala — algo que acontece enquanto você scrolleia o celular, come, conversa. O resultado é que você passa duas horas com um filme e sai sem nada, além da vaga sensação de ter gostado ou não gostado.</p>
<p>Ver cinema ativamente significa tratar o filme como um texto que precisa ser lido em camadas: o que está sendo dito explicitamente, o que está sendo comunicado pela câmera, pela música, pelas cores, pelos silêncios. Essa leitura transforma completamente a experiência — e começa a revelar por que certos filmes ficam na memória por anos.</p>
<h2>Três coisas para observar em qualquer filme</h2>
<p>O primeiro é o enquadramento. Onde a câmera está posicionada em relação ao personagem? Uma câmera baixa, olhando para cima, transmite poder. Uma câmera alta, olhando para baixo, transmite vulnerabilidade. Não é acidente — é intenção.</p>
<p>O segundo é a paleta de cores. Filmes usam cores de forma simbólica e emocional. Tons frios (azul, cinza, verde escuro) criam distância e tensão. Tons quentes (laranja, vermelho, amarelo) constroem intimidade e urgência. Quando a paleta muda dentro de um mesmo filme, geralmente sinaliza uma mudança de estado emocional ou narrativo.</p>
<p>O terceiro é o que não está sendo dito. Os melhores diálogos de cinema raramente tratam explicitamente do que está em jogo. Dois personagens discutindo sobre onde jantar podem estar, na verdade, discutindo o fim de um relacionamento. A tensão entre o subtext e o texto visível é onde a atuação e a direção revelam sua qualidade.</p>
<h2>O hábito de assistir uma vez mais</h2>
<p>Rever um filme que você gostou muito — com essa nova atenção — é uma das experiências mais reveladoras que o cinema oferece. Na segunda vez, você não está mais preso pela narrativa; você pode observar como ela foi construída. E quase sempre, o que parecia mágico na primeira vez tem uma arquitetura precisa por trás.</p>
  `.trim(),
});

console.log('\nConcluído!');
db.close();
