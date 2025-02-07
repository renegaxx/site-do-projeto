// Importação das bibliotecas Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAkP-I25nJEg6euMw70y09_7d6SpMQPBL0",
    authDomain: "puthype-server.firebaseapp.com",
    projectId: "puthype-server",
    storageBucket: "puthype-server.firebaseapp.com",
    messagingSenderId: "453444696907",
    appId: "1:453444696907:web:fb9b901e785c56cd97c6ce"
};

// Inicializar Firebase e Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };  // Exporta `app`, `auth`, `db`

// Função para ir para a seleção de avatar
window.goToAvatarSelection = function () {
    const fullName = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (fullName === "" || phone === "" || username === "" || email === "" || password === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    // Esconde a primeira etapa e mostra a segunda
    document.getElementById('register-step-1').style.display = 'none';
    document.getElementById('register-step-2').style.display = 'block';
};

// Gerencia a seleção de avatares
window.selectAvatar = function (avatarIndex) {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => option.classList.remove('selected')); // Remove a seleção anterior

    const selectedAvatar = avatarOptions[avatarIndex - 1]; // Seleciona o avatar correspondente
    selectedAvatar.classList.add('selected');

    // Define o valor do avatar selecionado no campo oculto
    document.getElementById('selected-avatar').value = avatarIndex;

    // Habilita o botão de cadastro
    const registerButton = document.getElementById('register-button');
    registerButton.disabled = false;
};

// Função de login
window.handleLogin = function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email === "" || password === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert('Login bem-sucedido!');
            handleLoginSuccess();
        })
        .catch((error) => {
            alert('Erro: ' + error.message);
        });
};

// Função de cadastro (combina os dados das duas etapas)
window.handleRegister = function () {
    const fullName = document.getElementById('register-name').value;
    const phone = document.getElementById('register-phone').value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const selectedAvatar = document.getElementById('selected-avatar').value;

    if (selectedAvatar === "") {
        alert("Por favor, escolha um avatar.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userRef = doc(db, "users", user.uid);

            // Salva informações adicionais no Firestore
            setDoc(userRef, {
                fullName: fullName,
                phone: phone,
                username: username,
                email: email,
                avatar: selectedAvatar
            })
            .then(() => {
                alert('Cadastro bem-sucedido!');
                window.location.href = 'boasvindas.html';
            })
            .catch((error) => {
                alert('Erro ao salvar dados no Firestore: ' + error.message);
            });
        })
        .catch((error) => {
            alert('Erro no cadastro: ' + error.message);
        });
};

// Função para resetar a senha
window.handleResetPassword = function () {
    const email = prompt('Digite seu e-mail para redefinir a senha:');
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert('Um e-mail de redefinição foi enviado!');
            })
            .catch((error) => {
                alert('Erro: ' + error.message);
            });
    }
};

// Função para alternar entre login e cadastro
window.toggleForm = function () {
    const loginContainer = document.getElementById("login-container");
    const registerContainer = document.getElementById("register-container");

    if (loginContainer.style.display === "none") {
        loginContainer.style.display = "block";
        registerContainer.style.display = "none";
    } else {
        loginContainer.style.display = "none";
        registerContainer.style.display = "block";
    }
};

// Função para animação e redirecionamento após login bem-sucedido
function handleLoginSuccess() {
    const loginContainer = document.getElementById('login-container');
    loginContainer.classList.add('fade-out');

    // Cria e exibe logo centralizada
    const logoCenter = document.createElement('img');
    logoCenter.src = 'assets/logo.png';
    logoCenter.id = 'logo-center';
    document.body.appendChild(logoCenter);

    setTimeout(() => {
        window.location.href = 'boasvindas.html';
    }, 2500);
}
