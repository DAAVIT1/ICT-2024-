// Star background generation
function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        star.style.opacity = Math.random();
        container.appendChild(star);
    }
}

// Navigation handling
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            sections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('active');
            });
            const targetSection = document.getElementById(sectionId);
            targetSection.classList.remove('hidden');
            setTimeout(() => targetSection.classList.add('active'), 10);
        });
    });
}

let currentQuiz = 0;
let score = 0;
let answeredQuestions = new Set();

// Quiz data
const quizData = [
    {
        question: "რა არის მზის სისტემის ყველაზე დიდი პლანეტა?",
        options: ["სატურნი", "იუპიტერი", "ურანი", "ნეპტუნი"],
        correct: 1
    },
    {
        question: "რამდენი ბუნებრივი თანამგზავრი ჰყავს დედამიწას?",
        options: ["არცერთი", "ერთი", "ორი", "სამი"],
        correct: 1
    },
    {
        question: "რომელი გალაქტიკის ნაწილია მზის სისტემა?",
        options: ["ანდრომედას გალაქტიკა", "ირმის ნახტომი", "სამკუთხედი გალაქტიკა", "მაგელანის ღრუბელი"],
        correct: 1
    },
    {
        question: "რა მანძილზეა მზე დედამიწიდან?",
        options: ["50 მილიონი კმ", "150 მილიონი კმ", "250 მილიონი კმ", "350 მილიონი კმ"],
        correct: 1
    },
    {
        question: "რომელია მზესთან ყველაზე ახლოს მდებარე პლანეტა?",
        options: ["ვენერა", "მარსი", "მერკური", "დედამიწა"],
        correct: 2
    }
];

function initQuiz() {
    // Reset quiz state
    currentQuiz = 0;
    score = 0;
    answeredQuestions.clear();
    
    // Reset quiz UI
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
                <span>კითხვა <span id="current-question">1</span>/<span id="total-questions">5</span></span>
            </div>
            <div class="w-full bg-blue-900/20 rounded-full h-2.5">
                <div id="progress-bar" class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: 20%"></div>
            </div>
        </div>
        <div id="question-container" class="mb-6"></div>
        <div id="options-container" class="space-y-3 mb-6"></div>
        <div id="feedback-container" class="hidden mb-6"></div>
        <div class="flex justify-between">
            <button id="prev-btn" class="hidden px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onclick="navigateQuiz(-1)">წინა</button>
            <button id="next-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onclick="navigateQuiz(1)" disabled>შემდეგი</button>
        </div>
    `;
    
    // Load first question
    loadQuiz();
}

function loadQuiz() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressBar = document.getElementById('progress-bar');
    const feedbackContainer = document.getElementById('feedback-container');

    feedbackContainer.classList.add('hidden');
    feedbackContainer.innerHTML = '';

    const currentQuizData = quizData[currentQuiz];
    questionContainer.innerHTML = `<h2 class="text-xl font-bold">${currentQuizData.question}</h2>`;
    optionsContainer.innerHTML = '';

    currentQuestionSpan.textContent = currentQuiz + 1;
    totalQuestionsSpan.textContent = quizData.length;
    progressBar.style.width = `${((currentQuiz + 1) / quizData.length) * 100}%`;

    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option w-full text-left p-4 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 transition border border-blue-700';
        button.innerHTML = option;
        
        if (answeredQuestions.has(currentQuiz)) {
            button.disabled = true;
            if (index === currentQuizData.correct) {
                button.classList.add('correct-answer');
            }
        } else {
            button.addEventListener('click', () => selectAnswer(index));
        }
        
        optionsContainer.appendChild(button);
    });

    updateNavigationButtons();
}

function navigateQuiz(direction) {
    if (currentQuiz === quizData.length - 1 && direction === 1 && answeredQuestions.has(currentQuiz)) {
        showResults();
        return;
    }
    
    currentQuiz += direction;
    loadQuiz();
}

function selectAnswer(index) {
    if (answeredQuestions.has(currentQuiz)) return;

    const feedback = document.getElementById('feedback-container');
    const options = document.querySelectorAll('.quiz-option');
    const currentQuizData = quizData[currentQuiz];

    answeredQuestions.add(currentQuiz);
    
    options.forEach(option => option.disabled = true);
    
    if (index === currentQuizData.correct) {
        options[index].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-green-900/40 border border-green-600 rounded-lg p-4">
                <p class="text-green-400">სწორია! 🎉</p>
            </div>
        `;
        score++;
    } else {
        options[index].classList.add('wrong-answer');
        options[currentQuizData.correct].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-red-900/40 border border-red-600 rounded-lg p-4">
                <p class="text-red-400">არასწორია! სწორი პასუხია: ${currentQuizData.options[currentQuizData.correct]}</p>
            </div>
        `;
    }

    feedback.classList.remove('hidden');
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.classList.toggle('hidden', currentQuiz === 0);
    
    if (currentQuiz === quizData.length - 1) {
        nextBtn.textContent = answeredQuestions.has(currentQuiz) ? 'დასრულება' : 'შემდეგი';
    } else {
        nextBtn.textContent = 'შემდეგი';
    }

    nextBtn.disabled = !answeredQuestions.has(currentQuiz);
}

function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    const percentage = (score / quizData.length) * 100;
    
    quizContainer.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">ქვიზი დასრულებულია!</h2>
            <p class="text-xl mb-4">თქვენი ქულაა: ${score}/${quizData.length} (${percentage}%)</p>
            <div class="mb-6">
                ${getResultMessage(percentage)}
            </div>
            <button onclick="initQuiz()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                თავიდან დაწყება
            </button>
        </div>
    `;
}

function getResultMessage(percentage) {
    if (percentage === 100) {
        return '<p class="text-green-400">შესანიშნავი! თქვენ ბრწყინვალედ იცით ასტრონომია! 🌟</p>';
    } else if (percentage >= 80) {
        return '<p class="text-green-400">ძალიან კარგი! თქვენ კარგად იცით ასტრონომია! 🎉</p>';
    } else if (percentage >= 60) {
        return '<p class="text-yellow-400">კარგია! მცირე დახვეწა გჭირდებათ! 👍</p>';
    } else {
        return '<p class="text-red-400">გააგრძელეთ მეცადინეობა! 📚</p>';
    }
}

// Game functionality
let gameActive = false;
let gameScore = 0;
let gameLevel = 1;

function initGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const spacecraft = new THREE.Mesh(geometry, material);
    scene.add(spacecraft);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        if (gameActive) {
            spacecraft.rotation.x += 0.01;
            spacecraft.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }

    animate();

    document.getElementById('start-game').addEventListener('click', () => {
        gameActive = true;
        document.getElementById('mission-info').classList.remove('hidden');
        document.getElementById('mission-description').textContent = `მისია ${gameLevel}: შეაგროვე ${gameLevel * 10} ვარსკვლავი`;
    });
}

// Event listeners
document.getElementById('next-btn').addEventListener('click', () => {
    if (currentQuiz === quizData.length - 1) {
        showResults();
    } else {
        currentQuiz++;
        loadQuiz();
    }
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuiz > 0) {
        currentQuiz--;
        loadQuiz();
    }
});

document.querySelector('[data-section="quiz"]').addEventListener('click', initQuiz);

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initNavigation();
    loadQuiz();
    initGame();

    document.getElementById('home').classList.remove('hidden');
    setTimeout(() => document.getElementById('home').classList.add('active'), 10);
});





document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    document.getElementById('home').classList.remove('hidden');
    
    // Navigation buttons logic
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });

    // Modal logic for gallery images
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModal = document.getElementById('closeModal');

    // Add click event to all gallery items
    document.querySelectorAll('#gallery-grid > div').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('p');
            
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalCaption.textContent = caption.textContent;
            imageModal.classList.remove('hidden');
        });
    });

    // Close modal on button click
    closeModal.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });

    // Close modal on outside click
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
    });

    // Close modal on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            imageModal.classList.add('hidden');
        }
    });
});









// Add this to your existing script
document.addEventListener('DOMContentLoaded', () => {
    // Show home section and animate content
    const home = document.getElementById('home');
    const featuresGrid = document.getElementById('features-grid');
    const coursesGrid = document.getElementById('courses-grid');
    
    // Remove hidden class and add active class
    home.classList.remove('hidden');
    home.classList.add('active');
    
    // Animate features and courses with a slight delay
    setTimeout(() => {
        featuresGrid.style.opacity = '1';
        featuresGrid.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            coursesGrid.style.opacity = '1';
            coursesGrid.style.transform = 'translateY(0)';
        }, 200);
    }, 100);

    // Rest of your existing initialization code...
    createStars();
    initNavigation();
    loadQuiz();
    initGame();
});

// Update your initNavigation function
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });
}





document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const mobileNavItems = document.querySelector('.mobile-nav-items');
    const navButtons = document.querySelectorAll('.nav-btn');

    // მობილური მენიუს ტოგლი
    mobileMenuButton.addEventListener('click', () => {
        mobileNavItems.classList.toggle('active');
    });

    // ნავიგაციის ღილაკებზე კლიკის დამუშავება
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ყველა ღილაკიდან active კლასის მოხსნა
            navButtons.forEach(btn => btn.classList.remove('active'));
            // დაკლიკებულ ღილაკზე active კლასის დამატება
            button.classList.add('active');
            
            // მობილურზე მენიუს დახურვა არჩევის შემდეგ
            if (window.innerWidth <= 768) {
                mobileNavItems.classList.remove('active');
            }
        });
    });

    // მენიუს დახურვა გარე კლიკზე
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && mobileNavItems.classList.contains('active')) {
            mobileNavItems.classList.remove('active');
        }
    });
});


















// კურსების ინფორმაციის ობიექტი
const courseInfo = {
    'შესავალი ასტრონომიაში': {
        description: 'ასტრონომია არის მეცნიერება, რომელიც სწავლობს ციურ სხეულებს, მათ შორის ვარსკვლავებს, პლანეტებს, კომეტებს და გალაქტიკებს. ამ კურსში თქვენ შეისწავლით:',
        topics: [
            'მზის სისტემის აგებულება',
            'ვარსკვლავთა ტიპები და ევოლუცია',
            'გალაქტიკების კლასიფიკაცია',
            'კოსმოლოგიის საფუძვლები'
        ],
        duration: '12 კვირა',
        difficulty: 'საწყისი დონე'
    },
    'ეგზოპლანეტები': {
        description: 'ეგზოპლანეტები არის პლანეტები, რომლებიც მოძრაობენ სხვა ვარსკვლავების გარშემო. ამ კურსში განვიხილავთ:',
        topics: [
            'ეგზოპლანეტების აღმოჩენის მეთოდები',
            'ჰაბიტაბელური ზონები',
            'ცნობილი ეგზოპლანეტური სისტემები',
            'სიცოცხლის შესაძლებლობა სხვა პლანეტებზე'
        ],
        duration: '8 კვირა',
        difficulty: 'საშუალო დონე'
    },
    'კოსმოსური მისიები': {
        description: 'კოსმოსური მისიები მოიცავს ადამიანის და რობოტულ მოგზაურობებს კოსმოსში. კურსში განხილული იქნება:',
        topics: [
            'კოსმოსური ხომალდების ტიპები',
            'ისტორიული კოსმოსური მისიები',
            'თანამედროვე კოსმოსური პროგრამები',
            'მომავლის კოსმოსური მისიები'
        ],
        duration: '10 კვირა',
        difficulty: 'მაღალი დონე'
    }
};

// CSS სტილების დამატება
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .modal-backdrop {
        backdrop-filter: blur(8px);
        transition: all 0.3s ease-out;
    }
    
    .modal-content {
        transform: scale(0.95);
        opacity: 0;
        transition: all 0.3s ease-out;
    }
    
    .modal-active .modal-content {
        transform: scale(1);
        opacity: 1;
    }
    
    .glow-effect {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    }
    
    .star-bg {
        background-image: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1) 0%, transparent 60%),
                          radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.1) 0%, transparent 60%);
    }
    
    .topic-item {
        transition: all 0.2s ease;
        position: relative;
    }
    
    .topic-item:hover {
        transform: translateX(10px);
        color: #fff;
    }
    
    .topic-item::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        background: #3B82F6;
        border-radius: 50%;
    }
    
    @keyframes modalFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(styleSheet);

// მოდალური ფანჯრის HTML-ის შექმნა
const modalHTML = `
    <div id="courseModal" class="fixed inset-0 bg-black bg-opacity-40 modal-backdrop hidden flex items-center justify-center p-4 z-50">
        <div class="modal-content bg-blue-900/90 star-bg backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full relative glow-effect">
            <button id="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div id="modalContent" class="space-y-6"></div>
        </div>
    </div>
`;

// მოდალის დამატება დოკუმენტში
document.body.insertAdjacentHTML('beforeend', modalHTML);

// ელემენტების მოძიება
const modal = document.getElementById('courseModal');
const modalContent = document.getElementById('modalContent');
const closeButton = document.getElementById('closeModal');
const startButtons = document.querySelectorAll('button');

// მოდალის დახურვის ფუნქცია
function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('modal-active');
    document.body.style.overflow = 'auto';
}

// მოდალის გახსნის ფუნქცია
function openModal(courseTitle) {
    const course = courseInfo[courseTitle];
    
    modalContent.innerHTML = `
        <div class="border-b border-blue-500/30 pb-4">
            <h2 class="text-3xl font-bold text-white mb-2">${courseTitle}</h2>
            <div class="flex gap-4">
                <span class="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    ${course.duration}
                </span>
                <span class="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    ${course.difficulty}
                </span>
            </div>
        </div>
        
        <div class="py-4">
            <p class="text-gray-300 leading-relaxed">${course.description}</p>
        </div>
        
        <div class="space-y-4">
            <h4 class="font-bold text-xl text-white">კურსის თემები</h4>
            <ul class="space-y-3">
                ${course.topics.map(topic => `
                    <li class="text-gray-300 topic-item pl-2">${topic}</li>
                `).join('')}
            </ul>
        </div>
        
        <div class="pt-6 flex justify-between items-center border-t border-blue-500/30 mt-6">
            <div class="text-blue-300 text-sm">
                <span class="block">დაიწყე სწავლა დღესვე</span>
                <span class="block mt-1">შემოგვიერთდი კოსმოსურ მოგზაურობაში</span>
            </div>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                კურსზე რეგისტრაცია
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('modal-active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

// დახურვის ღილაკზე მოვლენის დამატება
closeButton.addEventListener('click', closeModal);

// მოდალის გარეთ დაკლიკებაზე დახურვა
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Escape ღილაკზე დახურვა
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// დაწყების ღილაკებზე მოვლენების დამატება
startButtons.forEach(button => {
    button.addEventListener('click', function() {
        const courseTitle = this.parentElement.querySelector('h3').textContent;
        openModal(courseTitle);
    });
});


