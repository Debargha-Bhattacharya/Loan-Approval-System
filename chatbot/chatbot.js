document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat features
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatBody = document.querySelector('.chat-body');
    const featureCards = document.querySelectorAll('.feature-card');
    const tags = document.querySelectorAll('.tag');
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const suggestionChips = document.querySelectorAll('.chip');

    // Animate feature cards on hover
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });

    // Handle tag removal
    tags.forEach(tag => {
        const closeBtn = tag.querySelector('.fa-times');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tag.style.transform = 'scale(0.8)';
            tag.style.opacity = '0';
            setTimeout(() => tag.remove(), 300);
        });
    });

    // Simple responses object
    const botResponses = {
        'loan requirements': 'To apply for a loan, you typically need:\n• Valid ID proof\n• Income proof\n• Bank statements\n• Credit score above 650\n• Age between 21-65 years',
        'interest rates': 'Our current interest rates are:\n• Personal Loan: 10.99% - 24.99% p.a.\n• Home Loan: 6.99% - 9.99% p.a.\n• Business Loan: 15.99% - 29.99% p.a.',
        'application process': '1. Fill out the online application form\n2. Submit required documents\n3. Wait for verification (24-48 hours)\n4. Receive loan approval\n5. Sign documents\n6. Get disbursement',
        'emi calculator': 'You can calculate your EMI using our online calculator at example.com/emi-calculator. Would you like me to help you calculate it now?',
        'hi': 'Hello! 👋 I\'m your loan assistant. How can I help you today?',
        'hello': 'Hello! 👋 I\'m your loan assistant. How can I help you today?',
        'how are you': 'I\'m doing great! How can I help you today?',
        'what is your name': 'I\'m your loan assistant. How can I help you today?',
        'what is your purpose': 'I\'m your loan assistant. How can I help you today?',
        'what is your goal': 'I\'m your loan assistant. How can I help you today?',
        'default': "I'm not sure about that. Could you please rephrase your question or choose from the suggestion chips below?"
    };

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Add bot icon for bot messages
        if (!isUser) {
            const botIcon = document.createElement('div');
            botIcon.className = 'bot-icon message-icon';
            const iconI = document.createElement('i');
            iconI.className = 'fas fa-robot';
            botIcon.appendChild(iconI);
            messageDiv.appendChild(botIcon);
        }
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        messageWrapper.appendChild(messageContent);
        messageWrapper.appendChild(messageTime);
        messageDiv.appendChild(messageWrapper);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for matching responses
        for (const key in botResponses) {
            if (message.includes(key)) {
                return botResponses[key];
            }
        }
        
        return botResponses.default;
    }

    // Add this function to show/hide typing indicator
    function showTypingIndicator(show = true) {
        const indicator = document.querySelector('.typing-indicator');
        indicator.style.display = show ? 'flex' : 'none';
    }

    // Update your handleUserInput function
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input
            userInput.value = '';
            
            // Show typing indicator
            showTypingIndicator(true);
            
            // Add bot response after a delay
            setTimeout(() => {
                showTypingIndicator(false);
                const botResponse = getBotResponse(message);
                addMessage(botResponse);
            }, 1500); // Increased delay to show typing indicator
        }
    }

    // Event listeners
    sendButton.addEventListener('click', handleUserInput);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Update chip click handlers too
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const chipText = chip.textContent;
            addMessage(chipText, true);
            
            showTypingIndicator(true);
            setTimeout(() => {
                showTypingIndicator(false);
                const botResponse = getBotResponse(chipText.toLowerCase());
                addMessage(botResponse);
            }, 1500);
        });
    });

    // Add message styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .message {
            margin: 15px 0;
            opacity: 0;
            transform: translateY(20px);
            animation: messageAppear 0.3s forwards;
        }

        .message-content {
            max-width: 70%;
            padding: 12px 20px;
            border-radius: 15px;
            position: relative;
        }

        .user-message {
            text-align: right;
        }

        .user-message .message-content {
            background: var(--accent-blue);
            color: white;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }

        .bot-message .message-content {
            background: white;
            color: var(--text-primary);
            margin-right: auto;
            border-bottom-left-radius: 5px;
        }

        .time {
            font-size: 0.7rem;
            opacity: 0.7;
            margin-top: 5px;
            display: block;
        }

        @keyframes messageAppear {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    document.head.appendChild(style);

    // Mobile menu toggle
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.chat-header').prepend(menuBtn);

    menuBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Add mobile menu button styles
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.2rem;
            color: var(--text-primary);
            cursor: pointer;
            margin-right: 15px;
        }

        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: block;
            }
        }
    `;

    document.head.appendChild(mobileStyle);

    // Handle close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            window.location.href = '/home/home-main.html';
        });
    }
});

