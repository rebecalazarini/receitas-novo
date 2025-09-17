import './App.css'
import { useState, useEffect } from 'react'

type Receita = {
  id: number;
  nome: string;
  ingredientes: string[];
  modoFazer: string;
  img: string;
  tipo: string;
  custoAproximado: number;
};

function App() {
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [modalReceita, setModalReceita] = useState<Receita | null>(null);
  const [isEditModal, setIsEditModal] = useState(false);

  const [novonome, setNovonome] = useState('');
  const [novosIngredientes, setNovosIngredientes] = useState<string[]>(['']);
  const [novomodoFazer, setNovomodoFazer] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [novaImg, setNovaImg] = useState('');
  const [custoAproximado, setCustoAproximado] = useState<number | ''>('');

  useEffect(() => {
    fetch('/receitas.json')
      .then((res) => res.json())
      .then((data) => {
        const receitasFormatadas = data.map((r: any) => ({
          ...r,
          ingredientes: Array.isArray(r.ingredientes)
            ? r.ingredientes
            : String(r.ingredientes).split(',').map((i) => i.trim()),
        }));
        setReceitas(receitasFormatadas);
      });
  }, []);

  const cadastrarReceita = async (novaReceita: Omit<Receita, 'id'>) => {
    const response = await fetch('https://receitasapi-b-2025.vercel.app/receitas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...novaReceita,
        ingredientes: Array.isArray(novaReceita.ingredientes)
          ? novaReceita.ingredientes.join(', ')
          : novaReceita.ingredientes,
        tipo: novaReceita.tipo,
        custoAproximado: novaReceita.custoAproximado,
      }),
    });
    const receitaCriada = await response.json();
    setReceitas([...receitas, {
      ...receitaCriada,
      ingredientes: typeof receitaCriada.ingredientes === 'string'
        ? receitaCriada.ingredientes.split(',').map(i => i.trim())
        : receitaCriada.ingredientes
    }]);
  };

  const excluirReceita = async (id: number) => {
    await fetch(`https://receitasapi-b-2025.vercel.app/receitas/${id}`, {
      method: 'DELETE',
    });
    setReceitas(receitas.filter((receita) => receita.id !== id));
  };

  const editarReceita = (id: number) => {
    const receita = receitas.find((r) => r.id === id) || null;
    setModalReceita(receita);
    setNovonome(receita?.nome || '');
    setNovosIngredientes(receita?.ingredientes || ['']);
    setNovomodoFazer(receita?.modoFazer || '');
    setNovoTipo(receita?.tipo || '');
    setNovaImg(receita?.img || '');
    setCustoAproximado(receita?.custoAproximado ?? '');
    setIsEditModal(true);
  };

  const salvarReceitaEditada = async () => {
    if (!modalReceita) return;

    const receitaEditada = {
      ...modalReceita,
      nome: novonome,
      ingredientes: Array.isArray(novosIngredientes)
        ? novosIngredientes.join(', ')
        : novosIngredientes,
      modoFazer: novomodoFazer,
      img: novaImg,
      tipo: novoTipo,
      custoAproximado: Number(custoAproximado),
    };

    await fetch(`https://receitasapi-b-2025.vercel.app/receitas/${modalReceita.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: novonome,
        ingredientes: Array.isArray(novosIngredientes)
          ? novosIngredientes.join(', ')
          : novosIngredientes,
        modoFazer: novomodoFazer,
        img: novaImg,
        tipo: novoTipo,
        custoAproximado: Number(custoAproximado),
      }),
    });

    setReceitas(receitas.map((receita) =>
      receita.id === receitaEditada.id
        ? {
            ...receitaEditada,
            ingredientes: typeof receitaEditada.ingredientes === 'string'
              ? receitaEditada.ingredientes.split(',').map(i => i.trim())
              : receitaEditada.ingredientes
          }
        : receita
    ));
    setIsEditModal(false);
  };

  const closeModal = () => {
    setModalReceita(null);
    setIsEditModal(false);
  };

  return (
    <>
      <header>
        <h1>Livro de Receitas</h1>
      </header>

      {/* Formulário de cadastro de nova receita */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await cadastrarReceita({
            nome: novonome,
            ingredientes: novosIngredientes,
            modoFazer: novomodoFazer,
            img: novaImg,
            tipo: novoTipo,
            custoAproximado: Number(custoAproximado),
          });
          setNovonome('');
          setNovosIngredientes(['']);
          setNovomodoFazer('');
          setNovoTipo('');
          setNovaImg('');
          setCustoAproximado('');
        }}
        style={{ marginBottom: '2rem' }}
      >
        <h2>Cadastrar Nova Receita</h2>
        <input
          type="text"
          placeholder="Nome da receita"
          value={novonome}
          onChange={(e) => setNovonome(e.target.value)}
          required
        />
        <textarea
          placeholder="Modo de preparo"
          value={novomodoFazer}
          onChange={(e) => setNovomodoFazer(e.target.value)}
          required
        />
        <h3>Ingredientes:</h3>
        {novosIngredientes.map((ingrediente, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Ingrediente ${idx + 1}`}
            value={ingrediente}
            onChange={(e) => {
              const newIngredientes = [...novosIngredientes];
              newIngredientes[idx] = e.target.value;
              setNovosIngredientes(newIngredientes);
            }}
            required
          />
        ))}
        <button
          type="button"
          onClick={() => setNovosIngredientes([...novosIngredientes, ''])}
        >
          Adicionar Ingrediente
        </button>
        <select
          value={novoTipo}
          onChange={(e) => setNovoTipo(e.target.value)}
          required
        >
          <option value="">Selecione o tipo</option>
          <option value="DOCE">Doce</option>
          <option value="SALGADA">Salgada</option>
        </select>
        <input
          type="text"
          placeholder="URL da imagem"
          value={novaImg}
          onChange={(e) => setNovaImg(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Custo aproximado"
          value={custoAproximado}
          onChange={(e) => setCustoAproximado(e.target.value)}
          required
          min={0}
          step="0.01"
        />
        <button type="submit">Cadastrar</button>
      </form>

      <main>
        {receitas.map((receita) => (
          <div key={receita.id} className="card">
            <h2>{receita.nome}</h2>
            <img src={receita.img} alt={receita.nome} />
            <p><strong>Tipo:</strong> {receita.tipo}</p>
            <p><strong>Custo aproximado:</strong> R$ {receita.custoAproximado}</p>
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
                  value={novonome}
                  onChange={(e) => setNovonome(e.target.value)}
                />
                <textarea
                  value={novomodoFazer}
                  onChange={(e) => setNovomodoFazer(e.target.value)}
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
                <button
                  type="button"
                  onClick={() => setNovosIngredientes([...novosIngredientes, ''])}
                >
                  Adicionar Ingrediente
                </button>
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="DOCE">Doce</option>
                  <option value="SALGADA">Salgada</option>
                </select>
                <input
                  type="text"
                  value={novaImg}
                  onChange={(e) => setNovaImg(e.target.value)}
                  placeholder="URL da imagem"
                />
                <input
                  type="number"
                  value={custoAproximado}
                  onChange={(e) => setCustoAproximado(e.target.value)}
                  placeholder="Custo aproximado"
                  min={0}
                  step="0.01"
                />
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
                <p>{modalReceita.modoFazer}</p>
                <p><strong>Tipo:</strong> {modalReceita.tipo}</p>
                <p><strong>Custo aproximado:</strong> R$ {modalReceita.custoAproximado}</p>
                <img src={modalReceita.img} alt={modalReceita.nome} style={{maxWidth: '100%'}} />
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