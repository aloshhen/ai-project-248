import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// SafeIcon component - converts kebab-case to PascalCase
const SafeIcon = ({ name, size = 24, className, color }) => {
  const [IconComponent, setIconComponent] = useState(null)
  
  useEffect(() => {
    import('lucide-react').then((icons) => {
      const pascalName = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
      const Component = icons[pascalName] || icons.HelpCircle
      setIconComponent(() => Component)
    })
  }, [name])
  
  if (!IconComponent) return null
  
  return <IconComponent size={size} className={className} color={color} />
}

// Web3Forms Hook
const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleSubmit = async (e, accessKey) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsError(false)
    
    const formData = new FormData(e.target)
    formData.append('access_key', accessKey)
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsSuccess(true)
        e.target.reset()
      } else {
        setIsError(true)
        setErrorMessage(data.message || 'Что-то пошло не так')
      }
    } catch (error) {
      setIsError(true)
      setErrorMessage('Ошибка сети. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const resetForm = () => {
    setIsSuccess(false)
    setIsError(false)
    setErrorMessage('')
  }
  
  return { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm }
}

// FAQ Data for Chat Widget
const FAQ_DATA = [
  {
    question: 'Сколько стоит щенок?',
    answer: 'Цена щенка японского шпица варьируется от 80 000 до 150 000 рублей в зависимости от родословной, окраса и класса.',
    keywords: ['цена', 'стоит', 'сколько', 'стоимость', 'рублей', 'дорого']
  },
  {
    question: 'Какие документы у щенков?',
    answer: 'Все щенки имеют метрику щенка (родословную), ветеринарный паспорт с отметками о прививках, чип и договор купли-продажи.',
    keywords: ['документы', 'родословная', 'метрика', 'паспорт', 'чип', 'прививки']
  },
  {
    question: 'В каком возрасте можно забирать щенка?',
    answer: 'Щенков можно забирать в новый дом не раньше 2 месяцев, когда они полностью привиты и социализированы.',
    keywords: ['возраст', 'забирать', 'когда', 'месяцев', 'домой']
  },
  {
    question: 'Как ухаживать за шерстью?',
    answer: 'Японский шпиц требует регулярного расчесывания 2-3 раза в неделю. Шерсть не пахнет и не линяет круглый год.',
    keywords: ['шерсть', 'уход', 'расчесывать', 'линька', 'груминг']
  },
  {
    question: 'Есть ли доставка?',
    answer: 'Да, мы организуем доставку по всей России и за рубеж. Также возможен самовывоз из питомника.',
    keywords: ['доставка', 'привезти', 'транспорт', 'город', 'регион']
  }
]

const SITE_CONTEXT = 'Профессиональный питомник японских шпицев. Продаем здоровых щенков с родословной, документами РКФ. Предоставляем консультации по уходу и воспитанию.'

// Puppy data
const PUPPIES = [
  {
    id: 1,
    name: 'Снежок',
    gender: 'мальчик',
    age: '2 месяца',
    color: 'белый',
    price: '95 000 ₽',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    status: 'available'
  },
  {
    id: 2,
    name: 'Белла',
    gender: 'девочка',
    age: '2.5 месяца',
    color: 'белый',
    price: '110 000 ₽',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&q=80',
    status: 'available'
  },
  {
    id: 3,
    name: 'Лайка',
    gender: 'девочка',
    age: '3 месяца',
    color: 'белый',
    price: '120 000 ₽',
    image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&q=80',
    status: 'reserved'
  },
  {
    id: 4,
    name: 'Мишка',
    gender: 'мальчик',
    age: '2 месяца',
    color: 'белый',
    price: '100 000 ₽',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
    status: 'available'
  }
]

const REVIEWS = [
  {
    id: 1,
    name: 'Анна М.',
    text: 'Взяли щенка 3 месяца назад. Очень довольны! Песик здоровый, послушный, шерсть просто шикарная. Спасибо заводчику за подробные консультации!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: 2,
    name: 'Сергей К.',
    text: 'Профессиональный подход! Все документы в порядке, щенок привит, чипирован. Доставили в другой город без проблем. Рекомендую!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
  },
  {
    id: 3,
    name: 'Марина П.',
    text: 'Давно мечтала о японском шпице. Нашла этот питомник и не пожалела! Белла — лучшее, что случилось в моей жизни. Спасибо!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
  }
]

// Chat Widget Component
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Здравствуйте! 👋 Я помогу вам узнать больше о наших щенках. Задайте вопрос!' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findFAQAnswer = (text) => {
    const lowerText = text.toLowerCase()
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerText.includes(keyword))) {
        return faq.answer
      }
    }
    return null
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return
    
    const userMessage = inputValue.trim()
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')
    setIsTyping(true)

    // Check FAQ first
    const faqAnswer = findFAQAnswer(userMessage)
    
    if (faqAnswer) {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: faqAnswer }])
        setIsTyping(false)
      }, 1000)
    } else {
      // Fallback message
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: 'Спасибо за вопрос! Чтобы получить подробную консультацию, оставьте заявку в форме ниже или позвоните нам. Мы ответим на все вопросы! 📞' 
        }])
        setIsTyping(false)
      }, 1500)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center transition-colors"
      >
        <SafeIcon name={isOpen ? 'x' : 'message-circle'} size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SafeIcon name="bot" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">Помощник</h3>
                <p className="text-white/80 text-xs">Обычно отвечает мгновенно</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[80%] p-3 rounded-2xl text-sm',
                    msg.type === 'user' 
                      ? 'bg-rose-500 text-white ml-auto rounded-br-md'
                      : 'bg-white text-stone-700 shadow-sm rounded-bl-md'
                  )}
                >
                  {msg.text}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-1 items-center text-stone-400 text-xs">
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 bg-stone-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <SafeIcon name="send" size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Main App Component
function App() {
  const [selectedPuppy, setSelectedPuppy] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const { isSubmitting, isSuccess, isError, errorMessage, handleSubmit, resetForm } = useFormHandler()
  const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your Web3Forms Access Key

  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const galleryRef = useRef(null)
  const reviewsRef = useRef(null)
  const contactRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isAboutInView = useInView(aboutRef, { once: true })
  const isGalleryInView = useInView(galleryRef, { once: true })
  const isReviewsInView = useInView(reviewsRef, { once: true })
  const isContactInView = useInView(contactRef, { once: true })

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % PUPPIES.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + PUPPIES.length) % PUPPIES.length)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <nav className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
              <SafeIcon name="heart" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-stone-800">Spitz<span className="text-rose-500">Family</span></span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('about')} className="text-stone-600 hover:text-rose-500 transition-colors font-medium">О породе</button>
            <button onClick={() => scrollToSection('gallery')} className="text-stone-600 hover:text-rose-500 transition-colors font-medium">Щенки</button>
            <button onClick={() => scrollToSection('reviews')} className="text-stone-600 hover:text-rose-500 transition-colors font-medium">Отзывы</button>
            <button onClick={() => scrollToSection('contact')} className="text-stone-600 hover:text-rose-500 transition-colors font-medium">Контакты</button>
          </div>

          <button 
            onClick={() => scrollToSection('contact')}
            className="hidden md:flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-rose-500/25"
          >
            <SafeIcon name="phone" size={18} />
            Заказать
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-stone-600"
          >
            <SafeIcon name={isMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-stone-100"
            >
              <div className="px-4 py-4 space-y-3">
                <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 text-stone-600 font-medium">О породе</button>
                <button onClick={() => scrollToSection('gallery')} className="block w-full text-left py-2 text-stone-600 font-medium">Щенки</button>
                <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-2 text-stone-600 font-medium">Отзывы</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-stone-600 font-medium">Контакты</button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="w-full bg-rose-500 text-white py-3 rounded-full font-semibold mt-2"
                >
                  Заказать щенка
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <SafeIcon name="award" size={16} />
                Профессиональный питомник
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-stone-800 leading-tight mb-6">
                Японский <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Шпиц</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-600 mb-8 leading-relaxed max-w-lg">
                Породистые щенки с родословной от профессиональных заводчиков. 
                Здоровье, красота и любовь в каждом питомце.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-rose-500/30"
                >
                  <SafeIcon name="search" size={20} />
                  Выбрать щенка
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-stone-200 hover:border-rose-300"
                >
                  <SafeIcon name="info" size={20} />
                  Узнать больше
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-3xl font-black text-rose-500">150+</div>
                  <div className="text-stone-500 text-sm">Счастливых семей</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-rose-500">10</div>
                  <div className="text-stone-500 text-sm">Лет опыта</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-rose-500">100%</div>
                  <div className="text-stone-500 text-sm">Здоровье</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80" 
                  alt="Японский шпиц" 
                  className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl shadow-rose-500/20"
                />
                {/* Floating badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <SafeIcon name="shield-check" size={24} className="text-green-500" />
                    <div>
                      <div className="text-xs text-stone-500">Гарантия</div>
                      <div className="font-bold text-stone-800">Здоровья</div>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <SafeIcon name="file-check" size={24} className="text-rose-500" />
                    <div>
                      <div className="text-xs text-stone-500">Документы</div>
                      <div className="font-bold text-stone-800">РКФ/FCI</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Breed Section */}
      <section 
        ref={aboutRef}
        id="about"
        className="py-20 md:py-32 bg-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-stone-800 mb-4">
              О породе <span className="text-rose-500">Японский шпиц</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Идеальный компаньон для всей семьи. Узнайте, почему эта порода так популярна по всему миру.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'heart', title: 'Ласковый', desc: 'Обожает своих хозяев и отлично ладит с детьми' },
              { icon: 'sparkles', title: 'Красивый', desc: 'Пышная белая шерсть не требует сложного ухода' },
              { icon: 'brain', title: 'Умный', desc: 'Быстро обучается командам и трюкам' },
              { icon: 'home', title: 'Компактный', desc: 'Идеальный размер для квартиры или дома' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-gradient-to-br from-stone-50 to-white p-8 rounded-3xl border border-stone-100 hover:border-rose-200 transition-all hover:shadow-xl hover:shadow-rose-500/10"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <SafeIcon name={item.icon} size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Breed Info Cards */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isAboutInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-rose-50 p-8 rounded-3xl"
            >
              <SafeIcon name="ruler" size={32} className="text-rose-500 mb-4" />
              <h4 className="text-lg font-bold text-stone-800 mb-2">Размер</h4>
              <p className="text-stone-600">Высота в холке: 30-37 см. Вес: 5-10 кг. Компактный и элегантный.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isAboutInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-rose-50 p-8 rounded-3xl"
            >
              <SafeIcon name="clock" size={32} className="text-rose-500 mb-4" />
              <h4 className="text-lg font-bold text-stone-800 mb-2">Продолжительность жизни</h4>
              <p className="text-stone-600">При правильном уходе живут 12-16 лет. Отличное здоровье породы.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isAboutInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-rose-50 p-8 rounded-3xl"
            >
              <SafeIcon name="scissors" size={32} className="text-rose-500 mb-4" />
              <h4 className="text-lg font-bold text-stone-800 mb-2">Уход за шерстью</h4>
              <p className="text-stone-600">Расчесывание 2-3 раза в неделю. Шерсть не пахнет и не линяет.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section 
        ref={galleryRef}
        id="gallery"
        className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-stone-800 mb-4">
              Наши <span className="text-rose-500">щенки</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Каждый щенок здоров, привит и имеет все необходимые документы. Выбирайте своего пушистого друга!
            </p>
          </motion.div>

          {/* Puppy Slider */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-auto">
                      <img 
                        src={PUPPIES[currentSlide].image} 
                        alt={PUPPIES[currentSlide].name}
                        className="w-full h-full object-cover"
                      />
                      {PUPPIES[currentSlide].status === 'reserved' && (
                        <div className="absolute top-4 left-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                          Зарезервирован
                        </div>
                      )}
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-3xl font-black text-stone-800 mb-4">{PUPPIES[currentSlide].name}</h3>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-stone-600">
                          <SafeIcon name="user" size={20} className="text-rose-500" />
                          <span>Пол: {PUPPIES[currentSlide].gender}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <SafeIcon name="calendar" size={20} className="text-rose-500" />
                          <span>Возраст: {PUPPIES[currentSlide].age}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-600">
                          <SafeIcon name="palette" size={20} className="text-rose-500" />
                          <span>Окрас: {PUPPIES[currentSlide].color}</span>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-rose-500 mb-6">{PUPPIES[currentSlide].price}</div>
                      <button 
                        onClick={() => {
                          setSelectedPuppy(PUPPIES[currentSlide].name)
                          scrollToSection('contact')
                        }}
                        disabled={PUPPIES[currentSlide].status === 'reserved'}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-full font-bold transition-all transform hover:scale-105"
                      >
                        {PUPPIES[currentSlide].status === 'reserved' ? 'Зарезервирован' : 'Забронировать'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Controls */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors"
            >
              <SafeIcon name="chevron-left" size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-stone-600 hover:text-rose-500 transition-colors"
            >
              <SafeIcon name="chevron-right" size={24} />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {PUPPIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    currentSlide === idx ? 'bg-rose-500 w-8' : 'bg-stone-300 hover:bg-stone-400'
                  )}
                />
              ))}
            </div>
          </div>

          {/* All Puppies Grid */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUPPIES.map((puppy, idx) => (
              <motion.div
                key={puppy.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isGalleryInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  'cursor-pointer rounded-2xl overflow-hidden border-2 transition-all',
                  currentSlide === idx ? 'border-rose-500 shadow-xl shadow-rose-500/20' : 'border-transparent hover:border-rose-200'
                )}
              >
                <div className="relative h-48">
                  <img src={puppy.image} alt={puppy.name} className="w-full h-full object-cover" />
                  {puppy.status === 'reserved' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold">Зарезервирован</span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <h4 className="font-bold text-stone-800">{puppy.name}</h4>
                  <p className="text-rose-500 font-semibold">{puppy.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section 
        ref={reviewsRef}
        id="reviews"
        className="py-20 md:py-32 bg-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isReviewsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-stone-800 mb-4">
              Отзывы <span className="text-rose-500">владельцев</span>
            </h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              Узнайте, что говорят о нас люди, которые уже стали счастливыми обладателями японского шпица.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isReviewsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-stone-50 to-white p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-stone-800">{review.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <SafeIcon key={i} name="star" size={16} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed italic">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        ref={contactRef}
        id="contact"
        className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-black text-stone-800 mb-4">
                Свяжитесь с <span className="text-rose-500">нами</span>
              </h2>
              <p className="text-stone-600 text-lg">
                Заполните форму, и мы свяжемся с вами в ближайшее время для консультации.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl shadow-rose-500/10 p-8 md:p-12"
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => handleSubmit(e, ACCESS_KEY)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-2">Ваше имя</label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Иван Иванов"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-2">Телефон</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+7 (999) 999-99-99"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-2">Выберите щенка</label>
                      <select
                        name="puppy"
                        value={selectedPuppy}
                        onChange={(e) => setSelectedPuppy(e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                      >
                        <option value="">Любой щенок</option>
                        {PUPPIES.filter(p => p.status === 'available').map(puppy => (
                          <option key={puppy.id} value={puppy.name}>{puppy.name} — {puppy.price}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-2">Сообщение</label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Ваши вопросы или пожелания..."
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                      ></textarea>
                    </div>

                    {isError && (
                      <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-2">
                        <SafeIcon name="alert-circle" size={20} />
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <SafeIcon name="send" size={20} />
                          Отправить заявку
                        </>
                      )}
                    </button>

                    <p className="text-center text-stone-500 text-sm">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <SafeIcon name="check-circle" size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Заявка отправлена!</h3>
                    <p className="text-stone-600 mb-8">
                      Спасибо за обращение! Мы свяжемся с вами в ближайшее время.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-rose-500 hover:text-rose-600 font-semibold"
                    >
                      Отправить еще одну заявку
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact Info */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                  <SafeIcon name="phone" size={24} className="text-rose-500" />
                </div>
                <div>
                  <div className="text-sm text-stone-500">Телефон</div>
                  <div className="font-bold text-stone-800">+7 (999) 123-45-67</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                  <SafeIcon name="mail" size={24} className="text-rose-500" />
                </div>
                <div>
                  <div className="text-sm text-stone-500">Email</div>
                  <div className="font-bold text-stone-800">info@spitzfamily.ru</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                  <SafeIcon name="map-pin" size={24} className="text-rose-500" />
                </div>
                <div>
                  <div className="text-sm text-stone-500">Адрес</div>
                  <div className="font-bold text-stone-800">Москва, ул. Пушистая, 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 telegram-safe-bottom">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                  <SafeIcon name="heart" size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold">Spitz<span className="text-rose-400">Family</span></span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Профессиональный питомник японских шпицев. 
                Здоровые щенки с родословной для самых требовательных владельцев.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-rose-400 transition-colors">О породе</button></li>
                <li><button onClick={() => scrollToSection('gallery')} className="hover:text-rose-400 transition-colors">Щенки</button></li>
                <li><button onClick={() => scrollToSection('reviews')} className="hover:text-rose-400 transition-colors">Отзывы</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-rose-400 transition-colors">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Документы</h4>
              <ul className="space-y-2 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-rose-400 transition-colors">Договор купли-продажи</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Гарантия здоровья</a></li>
                <li><a href="#" className="hover:text-rose-400 transition-colors">Политика конфиденциальности</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Социальные сети</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-stone-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors">
                  <SafeIcon name="instagram" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-stone-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors">
                  <SafeIcon name="facebook" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-stone-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors">
                  <SafeIcon name="youtube" size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-stone-800 hover:bg-rose-500 rounded-full flex items-center justify-center transition-colors">
                  <SafeIcon name="telegram" size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-stone-500 text-sm">
            © 2024 SpitzFamily. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}

export default App