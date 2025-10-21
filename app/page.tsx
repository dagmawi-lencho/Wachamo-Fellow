'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { 
  Cross, BookOpen, Users, Heart, ArrowRight, ShoppingCart, Gift, 
  Star, Sparkles, Award, Mail, Phone, MapPin, ChevronDown
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const galleryImages = [
    '/photo_1_2025-10-21_18-33-12.jpg',
    '/photo_2_2025-10-21_18-33-12.jpg',
    '/photo_3_2025-10-21_18-33-12.jpg',
    '/photo_4_2025-10-21_18-33-12.jpg',
    '/photo_5_2025-10-21_18-33-12.jpg',
    '/photo_6_2025-10-21_18-33-12.jpg',
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Active Members' },
    { icon: BookOpen, value: '20+', label: 'Bible Study Groups' },
    { icon: Heart, value: '50+', label: 'Weekly Gatherings' },
    { icon: Award, value: '10+', label: 'Fellowship Teams' },
  ];

  const features = [
    {
      icon: Cross,
      title: 'Spiritual Growth',
      description: 'Join weekly Bible studies and discipleship programs designed to deepen your faith and understanding.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Community Fellowship',
      description: 'Connect with like-minded believers and build lasting friendships in a supportive, loving environment.',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      icon: Heart,
      title: 'Service & Outreach',
      description: 'Make a difference through community service, evangelism, and compassion-driven initiatives.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: 'Leadership Development',
      description: 'Discover and develop your spiritual gifts through mentorship and leadership opportunities.',
      color: 'from-green-500 to-teal-500'
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Fellowship Logo" fill className="object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">
                  Wachamo Fellowship
                </h1>
                <p className="text-xs text-gray-600">BSC Team</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-gray-700 hover:text-[#2ea7df] transition-colors font-medium">About</a>
              <a href="#gallery" className="text-gray-700 hover:text-[#2ea7df] transition-colors font-medium">Gallery</a>
              <a href="#features" className="text-gray-700 hover:text-[#2ea7df] transition-colors font-medium">Features</a>
              <Button
                variant="outline"
                onClick={() => router.push('/shop')}
                className="border-2 border-[#2ea7df] text-[#2ea7df] hover:bg-[#2ea7df] hover:text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop
              </Button>
              <Button
                onClick={() => router.push('/register')}
                className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white hover:shadow-lg hover:scale-105 transition-all"
              >
                Join Us
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/login')}
                className="text-gray-600"
              >
                Admin
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex gap-2">
              <Button size="sm" onClick={() => router.push('/register')} className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white">
                Join
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#2ea7df] rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f59f45] rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div style={{ y: y1 }} className="absolute top-32 left-20 opacity-20">
          <Cross className="w-24 h-24 text-[#2ea7df]" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-32 right-20 opacity-20">
          <BookOpen className="w-28 h-28 text-[#f59f45]" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-[#2ea7df]/30 shadow-lg mb-8">
              <Sparkles className="w-5 h-5 text-[#2ea7df]" />
              <span className="text-gray-700 font-medium">Welcome to Our Family</span>
              <Sparkles className="w-5 h-5 text-[#f59f45]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#2ea7df] via-purple-600 to-[#f59f45] bg-clip-text text-transparent">
              Growing Together
            </span>
            <br />
            <span className="text-gray-900">In Faith & Love</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Join a vibrant community of believers at Wachamo University. 
            Discover your purpose, deepen your faith, and make lifelong connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push('/register')}
              className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white text-lg px-12 py-7 rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all group"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/donate')}
              className="border-2 border-gray-300 text-gray-700 text-lg px-12 py-7 rounded-full hover:bg-gray-50"
            >
              <Gift className="w-5 h-5 mr-2" />
              Support Us
            </Button>
          </motion.div>

          <motion.div
            style={{ opacity }}
            className="mt-16 flex justify-center"
          >
            <a href="#stats" className="text-gray-400 hover:text-[#2ea7df] transition-colors">
              <ChevronDown className="w-8 h-8 animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#2ea7df] to-[#f59f45] rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-gradient-to-br from-gray-50 to-blue-50/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #2ea7df 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-[#2ea7df]/30 shadow-sm mb-6">
              <Star className="w-4 h-4 text-[#f59f45]" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">About Us</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Who <span className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">We Are</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are the Wachamo University Evangelical Students Union Fellowship BSC Team - 
              a passionate community dedicated to glorifying God through worship, discipleship, 
              and service.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/photo_7_2025-10-21_18-33-12.jpg"
                  alt="Fellowship gathering"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-2xl font-bold">United in Christ</p>
                  <p className="text-white/80">Building God&apos;s Kingdom Together</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#2ea7df] to-[#f59f45] rounded-3xl opacity-20"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#2ea7df] to-blue-600 rounded-xl flex items-center justify-center">
                  <Cross className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To make disciples of Jesus Christ among university students through 
                    intentional relationships, Biblical teaching, and Spirit-led ministry.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#f59f45] to-orange-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To see every student at Wachamo University encounter Jesus Christ and 
                    grow into mature, multiplying disciples who transform their world.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Our Values</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Faith, Community, Service, Excellence, and Love guide everything we do 
                    as we seek to honor God in our fellowship and beyond.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] text-white px-8 rounded-full hover:shadow-lg transition-all"
                >
                  Become a Member
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-orange-50 px-6 py-2 rounded-full border border-[#2ea7df]/30 shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#2ea7df]" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Gallery</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">Fellowship Life</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Witness the joy, faith, and community that defines our fellowship through these moments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                className="relative h-80 rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              >
                <Image
                  src={image}
                  alt={`Fellowship moment ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-lg font-bold">Fellowship Moment</p>
                    <p className="text-sm text-white/80">Together in Christ</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-br from-blue-50 to-orange-50/50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(45deg, #2ea7df 25%, transparent 25%), linear-gradient(-45deg, #2ea7df 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f59f45 75%), linear-gradient(-45deg, transparent 75%, #f59f45 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-[#2ea7df]/30 shadow-sm mb-6">
              <Award className="w-4 h-4 text-[#f59f45]" />
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">What We Offer</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Experience <span className="bg-gradient-to-r from-[#2ea7df] to-[#f59f45] bg-clip-text text-transparent">More</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the many ways we help you grow spiritually and build meaningful connections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-[#2ea7df] to-[#f59f45] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Cross className="absolute top-10 left-10 w-32 h-32" />
            <Cross className="absolute bottom-20 right-20 w-40 h-40" />
            <BookOpen className="absolute top-1/2 left-1/4 w-28 h-28" />
            <Heart className="absolute bottom-10 left-1/3 w-36 h-36" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Join hundreds of students discovering purpose, building faith, and making an eternal impact
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/register')}
                className="bg-white text-[#2ea7df] text-lg px-12 py-7 rounded-full shadow-2xl hover:bg-gray-50 hover:scale-105 transition-all group"
              >
                <span className="font-bold">Register Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/shop')}
                className="bg-transparent border-2 border-white text-white text-lg px-12 py-7 rounded-full hover:bg-white hover:text-[#2ea7df] transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Visit Shop
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Wachamo Fellowship</h3>
                  <p className="text-sm text-gray-400">BSC Team</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Growing together in faith, love, and service at Wachamo University.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><button onClick={() => router.push('/shop')} className="hover:text-white transition-colors">Shop</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Get Involved</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => router.push('/register')} className="hover:text-white transition-colors">Register</button></li>
                <li><button onClick={() => router.push('/donate')} className="hover:text-white transition-colors">Donate</button></li>
                <li><button onClick={() => router.push('/track-order')} className="hover:text-white transition-colors">Track Order</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contact@wachamo-fellow.org" className="hover:text-white transition-colors text-sm">
                    contact@fellowship.org
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+251 XXX XXX XXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Wachamo University</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Wachamo Fellowship BSC Team. Built with ❤️ by Dagmawi Lencho</p>
            <p className="mt-2 italic">&quot;For where two or three gather in my name, there am I with them.&quot; - Matthew 18:20</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
