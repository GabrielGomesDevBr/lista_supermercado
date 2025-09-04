document.addEventListener('DOMContentLoaded', () => {

    // --- INÍCIO DA CONFIGURAÇÃO DO FIREBASE ---

    // Configuração do Firebase usando variáveis de ambiente
    const firebaseConfig = {
      apiKey: window.FIREBASE_API_KEY || "AIzaSyCGEhMkaeE_s-m3sVEn3Pj-pzbBFP01Sw4",
      authDomain: window.FIREBASE_AUTH_DOMAIN || "lista-de-compras-pwa-9d312.firebaseapp.com",
      projectId: window.FIREBASE_PROJECT_ID || "lista-de-compras-pwa-9d312",
      storageBucket: window.FIREBASE_STORAGE_BUCKET || "lista-de-compras-pwa-9d312.firebasestorage.app",
      messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "654454254654",
      appId: window.FIREBASE_APP_ID || "1:654454254654:web:db0cf0f11bfa1f72e4356f"
    };

    // --- FIM DA CONFIGURAÇÃO DO FIREBASE ---


    // --- INICIALIZAÇÃO E LÓGICA DO APP ---

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Referências do DOM
    const shoppingList = document.getElementById('shopping-list');
    const purchasedList = document.getElementById('purchased-list');
    const addItemForm = document.getElementById('add-item-form');
    const itemInput = document.getElementById('item-input');
    const clearPurchasedButton = document.getElementById('clear-purchased-button');
    const categoryChips = document.getElementById('category-chips');
    const quickAddContainer = document.getElementById('quick-add-container');
    const themeToggle = document.getElementById('theme-toggle');
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const clearSearch = document.getElementById('clear-search');
    const itemCounter = document.getElementById('item-counter');
    const emptyStatePending = document.getElementById('empty-state-pending');

    // Itens pré-definidos expandidos
    const predefinedItems = {
        mantimentos: {
            icon: '🌾',
            items: ['Arroz', 'Feijão', 'Óleo', 'Açúcar', 'Sal', 'Café', 'Leite', 'Pão', 'Manteiga', 'Ovos', 'Farinha', 'Macarrão', 'Molho de tomate', 'Vinagre', 'Azeite', 'Leite condensado', 'Creme de leite', 'Fermento', 'Aveia', 'Quinoa']
        },
        limpeza: {
            icon: '🧽',
            items: ['Detergente', 'Sabão em pó', 'Amaciante', 'Água sanitária', 'Desinfetante', 'Esponja', 'Papel toalha', 'Saco de lixo', 'Limpa vidros', 'Desengordurante', 'Alvejante', 'Sabão em barra', 'Pano de chão', 'Vassoura', 'Rodo']
        },
        higiene: {
            icon: '🧴',
            items: ['Shampoo', 'Condicionador', 'Sabonete', 'Creme dental', 'Papel higiênico', 'Desodorante', 'Protetor solar', 'Escova de dente', 'Fio dental', 'Absorvente', 'Fraldas', 'Lenço umedecido', 'Perfume', 'Creme hidratante', 'Algodão']
        },
        carnes: {
            icon: '🥩',
            items: ['Carne bovina', 'Frango', 'Peixe', 'Carne suína', 'Linguiça', 'Bacon', 'Presunto', 'Mortadela', 'Salsicha', 'Hambúrguer', 'Peito de peru', 'Atum', 'Sardinha', 'Camarão', 'Carne moída']
        },
        frutas: {
            icon: '🍎',
            items: ['Banana', 'Maçã', 'Laranja', 'Limão', 'Mamão', 'Abacaxi', 'Uva', 'Morango', 'Manga', 'Pêra', 'Melancia', 'Melão', 'Kiwi', 'Abacate', 'Goiaba', 'Maracujá', 'Coco', 'Pêssego', 'Ameixa', 'Caqui']
        },
        verduras: {
            icon: '🥬',
            items: ['Alface', 'Tomate', 'Cebola', 'Alho', 'Cenoura', 'Batata', 'Brócolis', 'Couve-flor', 'Abobrinha', 'Berinjela', 'Pimentão', 'Pepino', 'Rúcula', 'Espinafre', 'Couve', 'Repolho', 'Beterraba', 'Rabanete', 'Aipo', 'Salsinha']
        },
        laticinios: {
            icon: '🧀',
            items: ['Queijo', 'Iogurte', 'Requeijão', 'Cream cheese', 'Mussarela', 'Prato', 'Parmesão', 'Ricota', 'Leite', 'Nata', 'Manteiga', 'Margarina', 'Ovos', 'Leite em pó', 'Doce de leite']
        },
        bebidas: {
            icon: '🥤',
            items: ['Água', 'Refrigerante', 'Suco', 'Cerveja', 'Vinho', 'Café', 'Chá', 'Água de coco', 'Isotônico', 'Energético', 'Leite', 'Leite de coco', 'Guaraná', 'Achocolatado', 'Vitamina']
        },
        congelados: {
            icon: '🧊',
            items: ['Pizza congelada', 'Lasanha', 'Sorvete', 'Açaí', 'Batata frita', 'Nuggets', 'Hambúrguer', 'Peixe', 'Camarão', 'Legumes', 'Frutas vermelhas', 'Pão de açúcar', 'Torta', 'Empanado', 'Polpa de fruta']
        },
        petiscos: {
            icon: '🍿',
            items: ['Biscoito', 'Chocolate', 'Bala', 'Chiclete', 'Pipoca', 'Amendoim', 'Castanha', 'Chips', 'Salgadinho', 'Bolacha', 'Wafer', 'Bombom', 'Pirulito', 'Drops', 'Paçoca']
        }
    };

    let itemsCollection = null;
    let allItems = [];
    let filteredItems = [];
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Função principal de inicialização
    const initializeApp = () => {
        // Lista global única para toda a família
        itemsCollection = db.collection('lista-familia');
        
        // Limpar URL de parâmetros antigos se existirem
        if (window.location.search) {
            window.history.replaceState({}, '', window.location.pathname);
        }
        
        // Inicializar tema
        initializeTheme();
        
        // Carregar categorias
        loadCategories();
        
        // Inicializar listeners
        setupEventListeners();
        
        // Carregar itens
        listenForItems();
    };

    // Inicializar tema
    const initializeTheme = () => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    };

    // Carregar categorias dinamicamente
    const loadCategories = () => {
        categoryChips.innerHTML = '';
        Object.keys(predefinedItems).forEach(categoryKey => {
            const category = predefinedItems[categoryKey];
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.dataset.category = categoryKey;
            chip.innerHTML = `${category.icon} ${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}`;
            chip.setAttribute('tabindex', '0');
            categoryChips.appendChild(chip);
        });
    };

    // Atualizar contador de itens
    const updateItemCounter = () => {
        const pendingCount = allItems.filter(item => !item.comprado).length;
        const totalCount = allItems.length;
        
        if (totalCount === 0) {
            itemCounter.textContent = 'Lista vazia';
        } else if (pendingCount === 0) {
            itemCounter.textContent = 'Tudo comprado! 🎉';
        } else {
            itemCounter.textContent = `${pendingCount} ${pendingCount === 1 ? 'item' : 'itens'}`;
        }
    };

    // Mostrar/esconder estado vazio
    const toggleEmptyState = () => {
        const pendingItems = allItems.filter(item => !item.comprado);
        emptyStatePending.classList.toggle('hidden', pendingItems.length > 0);
    };

    // Filtrar itens com base na busca
    const filterItems = (searchTerm = '') => {
        if (!searchTerm.trim()) {
            filteredItems = [...allItems];
        } else {
            filteredItems = allItems.filter(item => 
                item.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        renderFilteredItems();
    };

    // Renderizar itens filtrados
    const renderFilteredItems = () => {
        shoppingList.innerHTML = '';
        purchasedList.innerHTML = '';
        
        filteredItems.forEach(item => {
            renderItem(item);
        });
        
        // Se há busca ativa, não mostrar estado vazio
        if (searchInput.value.trim()) {
            emptyStatePending.classList.add('hidden');
        } else {
            toggleEmptyState();
        }
        
        // Esconder seção de comprados se estiver vazia
        document.getElementById('purchased-section').style.display = 
            purchasedList.children.length > 0 ? 'block' : 'none';
    };

    // Renderiza um único item na lista
    const renderItem = (item) => {
        const li = document.createElement('li');
        li.className = item.comprado ? 'purchased' : '';
        li.dataset.id = item.id;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'item-checkbox';
        checkbox.checked = item.comprado;
        checkbox.addEventListener('change', () => togglePurchased(item.id, !item.comprado));

        // Container do item (nome + quantidade)
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';

        // Nome do item (editável no clique duplo)
        const name = document.createElement('span');
        name.className = 'item-name';
        const quantity = item.quantidade || 1;
        name.textContent = quantity > 1 ? `${quantity}x ${item.nome}` : item.nome;
        
        // Edição do nome
        name.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = item.nome;
            input.className = 'item-name-edit';
            
            const save = () => {
                if (input.value.trim() && input.value.trim() !== item.nome) {
                    editItemName(item.id, input.value.trim());
                }
                name.style.display = '';
                input.remove();
            };
            
            input.addEventListener('blur', save);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') save();
                if (e.key === 'Escape') {
                    name.style.display = '';
                    input.remove();
                }
            });
            
            name.style.display = 'none';
            itemContent.appendChild(input);
            input.focus();
            input.select();
        });

        // Controles de quantidade (só para itens não comprados)
        const controls = document.createElement('div');
        controls.className = 'item-controls';

        if (!item.comprado) {
            // Botão diminuir quantidade
            const decreaseBtn = document.createElement('button');
            decreaseBtn.className = 'quantity-btn decrease';
            decreaseBtn.innerHTML = '−';
            decreaseBtn.title = 'Diminuir quantidade';
            decreaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if ((item.quantidade || 1) > 1) {
                    updateQuantity(item.id, -1);
                } else {
                    removeItem(item.id);
                }
            });

            // Botão aumentar quantidade
            const increaseBtn = document.createElement('button');
            increaseBtn.className = 'quantity-btn increase';
            increaseBtn.innerHTML = '+';
            increaseBtn.title = 'Aumentar quantidade';
            increaseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateQuantity(item.id, 1);
            });

            controls.appendChild(decreaseBtn);
            controls.appendChild(increaseBtn);
        }

        // Botão remover
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '✕';
        removeBtn.title = 'Remover item';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeItem(item.id);
        });

        controls.appendChild(removeBtn);

        // Montar estrutura
        itemContent.appendChild(name);
        li.appendChild(checkbox);
        li.appendChild(itemContent);
        li.appendChild(controls);

        if (item.comprado) {
            purchasedList.appendChild(li);
        } else {
            shoppingList.appendChild(li);
        }
    };

    // Ouve por atualizações na coleção de itens em tempo real
    const listenForItems = () => {
        itemsCollection.orderBy('adicionadoEm').onSnapshot(snapshot => {
            allItems = [];
            snapshot.forEach(doc => {
                const item = { id: doc.id, ...doc.data() };
                allItems.push(item);
            });
            
            // Atualizar contadores e estados
            updateItemCounter();
            
            // Aplicar filtros
            filterItems(searchInput.value);
        });
    };

    // Adiciona um novo item ao Firestore
    const addItem = (itemName) => {
        if (!itemName.trim()) return;
        
        // Verificar se item já existe na lista
        const existingItem = allItems.find(item => 
            item.nome.toLowerCase() === itemName.trim().toLowerCase()
        );
        
        if (existingItem) {
            // Se existe, aumentar quantidade
            const newQuantity = (existingItem.quantidade || 1) + 1;
            itemsCollection.doc(existingItem.id).update({ 
                quantidade: newQuantity,
                comprado: false // Desmarcar se estiver comprado
            });
            
            // Dar feedback visual
            const existingElement = document.querySelector(`li[data-id="${existingItem.id}"]`);
            if (existingElement) {
                existingElement.style.background = 'var(--secondary-color)';
                existingElement.style.color = 'white';
                setTimeout(() => {
                    existingElement.style.background = '';
                    existingElement.style.color = '';
                }, 1000);
            }
            return;
        }

        itemsCollection.add({
            nome: itemName.trim(),
            quantidade: 1,
            comprado: false,
            adicionadoEm: firebase.firestore.FieldValue.serverTimestamp()
        });
    };

    // Remove um item completamente
    const removeItem = (itemId) => {
        if (confirm('Tem certeza que deseja remover este item da lista?')) {
            itemsCollection.doc(itemId).delete();
        }
    };

    // Atualiza a quantidade de um item
    const updateQuantity = (itemId, delta) => {
        const item = allItems.find(i => i.id === itemId);
        if (!item) return;
        
        const newQuantity = Math.max(1, (item.quantidade || 1) + delta);
        itemsCollection.doc(itemId).update({ quantidade: newQuantity });
    };

    // Edita o nome de um item
    const editItemName = (itemId, newName) => {
        if (!newName.trim()) return;
        itemsCollection.doc(itemId).update({ nome: newName.trim() });
    };

    // Alterna o estado 'comprado' de um item
    const togglePurchased = (itemId, isPurchased) => {
        // Adicionar feedback haptic se disponível
        if (navigator.vibrate && isPurchased) {
            navigator.vibrate(50);
        }
        
        itemsCollection.doc(itemId).update({ comprado: isPurchased });
    };

    // Limpa os itens comprados
    const clearPurchased = () => {
        if (!confirm('Tem certeza que deseja remover todos os itens comprados?')) return;

        const batch = db.batch();
        itemsCollection.where('comprado', '==', true).get().then(snapshot => {
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        });
    };
    
    // Lógica para itens pré-definidos
    const showQuickAddItems = (categoryKey) => {
        quickAddContainer.innerHTML = '';
        
        // Gerencia a classe 'active' nos chips
        document.querySelectorAll('.chip').forEach(c => {
            if (c.dataset.category === categoryKey) {
                c.classList.add('active');
            } else {
                c.classList.remove('active');
            }
        });

        const items = predefinedItems[categoryKey].items;
        items.forEach(itemText => {
            const itemEl = document.createElement('div');
            itemEl.className = 'quick-add-item';
            itemEl.textContent = `+ ${itemText}`;
            itemEl.setAttribute('tabindex', '0');
            itemEl.addEventListener('click', () => {
                addItem(itemText);
                // Feedback visual
                itemEl.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    itemEl.style.transform = '';
                }, 150);
            });
            
            // Suporte a teclado
            itemEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    addItem(itemText);
                }
            });
            
            quickAddContainer.appendChild(itemEl);
        });
    };

    // Setup de todos os event listeners
    const setupEventListeners = () => {
        // Theme toggle
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        });

        // Search toggle
        searchToggle.addEventListener('click', () => {
            searchContainer.classList.toggle('hidden');
            if (!searchContainer.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                filterItems('');
            }
        });

        // Search input
        searchInput.addEventListener('input', (e) => {
            filterItems(e.target.value);
        });

        // Clear search
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            filterItems('');
            searchInput.focus();
        });

        // Form submit
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = itemInput.value.trim();
            if (value) {
                addItem(value);
                itemInput.value = '';
                
                // Fechar busca se estiver aberta
                if (!searchContainer.classList.contains('hidden')) {
                    searchContainer.classList.add('hidden');
                    searchInput.value = '';
                    filterItems('');
                }
            }
        });

        // Clear purchased
        clearPurchasedButton.addEventListener('click', clearPurchased);

        // Category chips
        categoryChips.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                const category = e.target.dataset.category;
                showQuickAddItems(category);
            }
        });

        // Support para teclado nos chips
        categoryChips.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('chip')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                showQuickAddItems(category);
            }
        });
    };

    // Remover event listeners duplicados (já foram movidos para setupEventListeners)

    // --- Service Worker ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('Service Worker registrado com sucesso:', registration))
                .catch(error => console.log('Falha ao registrar Service Worker:', error));
        });
    }

    // Inicia a aplicação
    initializeApp();
});
