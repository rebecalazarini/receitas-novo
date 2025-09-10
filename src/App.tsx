import './App.css'
import { useState, useEffect } from 'react'

type Receita = {
  id: number;
  titulo: string;
  ingredientes: string[];
  modoPreparo: string;
  imagem: string;
};

function App() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [modalReceita, setModalReceita] = useState<Receita | null>(null);
  const [isEditModal, setIsEditModal] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novosIngredientes, setNovosIngredientes] = useState<string[]>([]);
  const [novoModoPreparo, setNovoModoPreparo] = useState('');

  // Dados simulados de receitas
  useEffect(() => {
    const data = [
      {
        id: 1,
        titulo: "Bolo de Cenoura",
        ingredientes: [
          "2 xícaras de cenoura ralada",
          "1 xícara de açúcar",
          "1/2 xícara de óleo",
          "3 ovos",
          "2 xícaras de farinha de trigo",
          "1 colher de sopa de fermento em pó"
        ],
        modoPreparo: "Bata no liquidificador a cenoura, o açúcar, o óleo e os ovos. Misture com os ingredientes secos e asse em forno pré-aquecido a 180°C por 40 minutos.",
        imagem: "https://cozinha365.com.br/wp-content/uploads/2025/02/Bolo-de-cenoura-S.webp"
      },
      {
        id: 2,
        titulo: "Pão de Queijo",
        ingredientes: [
          "250g de polvilho doce",
          "100ml de leite",
          "50ml de óleo",
          "1 ovo",
          "100g de queijo minas ralado",
          "sal a gosto"
        ],
        modoPreparo: "Misture todos os ingredientes até formar uma massa homogênea. Modele os pães e asse em forno pré-aquecido a 180°C por 20 minutos.",
        imagem: "https://www.receitas-sem-fronteiras.com/media/hehe-3_crop.jpg/rh/pao-de-queijo-3-ingredientes.jpg"
      },
      {
        id: 3,
        titulo: "Bolo de Chocolate",
        ingredientes: [
          "2 xícaras de açúcar",
          "1 xícara de manteiga",
          "4 ovos",
          "2 xícaras de farinha de trigo",
          "1 xícara de chocolate em pó",
          "1 colher de sopa de fermento em pó"
        ],
        modoPreparo: "Bata o açúcar com a manteiga até obter um creme. Adicione os ovos, um a um, e misture bem. Incorpore os ingredientes secos e asse em forno pré-aquecido a 180°C por 50 minutos.",
        imagem: "https://recipesblob.oetker.com.br/assets/a81bc035eb7f407faaa2c93e04edaf78/750x910/bolo-de-aniversrio-de-chocolate.jpg"
      },
      {
        id: 4,
        titulo: "Bife à Cavalo",
        ingredientes: [
          "4 bifes de alcatra ou contra filé",
          "4 ovos",
          "sal e pimenta a gosto",
          "óleo para fritar"
        ],
        modoPreparo: "Tempere os bifes com sal e pimenta. Frite os bifes em uma frigideira com óleo quente. Em outra frigideira, frite os ovos. Sirva os bifes com os ovos por cima.",
        imagem: "https://www.comidaereceitas.com.br/wp-content/uploads/2011/03/bife_cavalo.jpg"
      }
    ];
    setReceitas(data);
  }, []);

  // Função para excluir receita
  const excluirReceita = (id: number) => {
    setReceitas(receitas.filter((receita) => receita.id !== id));
  };

  // Função para abrir o modal de edição
  const editarReceita = (id: number) => {
    const receita = receitas.find((r) => r.id === id) || null;
    setModalReceita(receita);
    setNovoTitulo(receita?.titulo || '');
    setNovosIngredientes(receita?.ingredientes || []);
    setNovoModoPreparo(receita?.modoPreparo || '');
    setIsEditModal(true);
  };

  // Função para salvar as edições
  const salvarReceitaEditada = () => {
    if (!modalReceita) return;

    const receitaEditada: Receita = {
      ...modalReceita,
      titulo: novoTitulo,
      ingredientes: novosIngredientes,
      modoPreparo: novoModoPreparo,
    };

    setReceitas(receitas.map((receita) =>
      receita.id === receitaEditada.id ? receitaEditada : receita
    ));
    setIsEditModal(false);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalReceita(null);
    setIsEditModal(false);
  };

  return (
    <>
      <header>
        <h1>Livro de Receitas</h1>
      </header>
      <main>
        {receitas.map((receita) => (
          <div key={receita.id} className="card">
            <h2>{receita.titulo}</h2>
            <img src={receita.imagem} alt={receita.titulo} />
            <button onClick={() => setModalReceita(receita)}>Ver Receita</button>
            <button onClick={() => editarReceita(receita.id)}>Editar</button>
            <button onClick={() => excluirReceita(receita.id)}>Excluir</button>
          </div>
        ))}
      </main>
      <footer>
        <h2>By rebecalazarini</h2>
      </footer>

      {/* Modal */}
      {modalReceita && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditModal ? 'Editar Receita' : 'Ver Receita'}</h2>

            {isEditModal ? (
              <>
                <input
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                />
                <textarea
                  value={novoModoPreparo}
                  onChange={(e) => setNovoModoPreparo(e.target.value)}
                />
                <h3>Ingredientes:</h3>
                {novosIngredientes.map((ingrediente, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={ingrediente}
                    onChange={(e) => {
                      const newIngredientes = [...novosIngredientes];
                      newIngredientes[idx] = e.target.value;
                      setNovosIngredientes(newIngredientes);
                    }}
                  />
                ))}
                <button onClick={salvarReceitaEditada}>Salvar</button>
              </>
            ) : (
              <>
                <h3>Ingredientes:</h3>
                <ul>
                  {modalReceita.ingredientes.map((ingrediente, idx) => (
                    <li key={idx}>{ingrediente}</li>
                  ))}
                </ul>
                <h3>Modo de Preparo:</h3>
                <p>{modalReceita.modoPreparo}</p>
              </>
            )}
            <button onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
