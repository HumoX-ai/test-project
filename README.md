Ushbu test loyiha reactning barcha muhim jihatlarini o'z ichiga oladi. Bir boshidan boshlasam:

## Umumiy struktura haqida aytib o'tsam

Loyiha arxitekturasini modulli va boshqarish oson bo'lishi uchun FSD (Feature Sliced Design) pattern asosida qurdim. Bu pattern yordamida kodni xususiyatlarga bo'lib ajratdim, bu esa kelajakda yangi funksiyalar qo'shishni osonlashtiradi va kod bazasini scalable qiladi.

Vite bilan ishlashni tanladim, chunki u tez kompilatsiya va hot reload xususiyatlari bilan development jarayonini juda qulay qiladi. Bu mening vaqtni tejashimga yordam berdi.

Shadcn UI komponentlaridan foydalanish orqali kodimni yanada tushunarli va oson qildim. Bu kutubxona tayyor komponentlar bilan ishlashni soddalashtiradi va professional ko'rinish beradi.

RTK Query dan foydalanish orqali API fetching jarayonini osonlashtirdim va caching muammosini hal qildim. Bu an'anaviy Redux slice laridan voz kechishimga imkon berdi, chunki RTK Query avtomatik caching va state boshqaruvini ta'minlaydi.

Nihoyat, lazy loading va code splitting orqali ilovani optimallashtirdim, bu foydalanuvchi tajribasini yaxshilaydi va yuklash vaqtini kamaytiradi.

## Xususiyatlar (Features)

- **Autentifikatsiya (Auth)**: Foydalanuvchilar uchun login va himoya qilingan marshrutlar. RTK Query yordamida API bilan ishlash.
- **Mahsulotlar (Products)**: Mahsulotlar ro'yxatini ko'rish, qidirish, filtratsiya va pagination. CRUD operatsiyalari.
- **Vazifalar (Tasks)**: Vazifalar boshqaruvi, shu jumladan yaratish, tahrirlash va bajarish.
- **Statistika (Statistics)**: Ma'lumotlarni vizualizatsiya qilish uchun chartlar va diagrammalar.
- **Loyihalar (Projects)**: Loyihalar sahifasi va boshqaruvi.
- **UI Komponentlari**: Shadcn UI bilan zamonaviy va responsive dizayn.
- **Tema o'zgartirish**: Qorong'u va yorug' rejimlar.
- **Lazy Loading**: Sahifalar va komponentlar uchun optimallashtirilgan yuklash.

## Texnologiyalar (Technologies Used)

- **React**: UI kutubxonasi.
- **TypeScript**: Statik tipizatsiya.
- **Vite**: Tez build va development server.
- **Shadcn UI**: Tayyor UI komponentlari.
- **RTK Query**: API so'rovlari va caching.
- **React Router**: Marshrutizatsiya.
- **Tailwind CSS**: Styling.
- **ESLint**: Kod sifatini tekshirish.

## Loyiha strukturasini tushuntirish

Loyiha FSD pattern bo'yicha tashkil etilgan:

- **app/**: Asosiy konfiguratsiyalar (providers, router, store).
- **entities/**: Biznes logika (product, statistics, user).
- **features/**: FSD xususiyatlari (auth, products, tasks).
- **pages/**: Sahifalar (auth, projects, statistics, tasks).
- **shared/**: Umumiy komponentlar va utilitlar.
- **widgets/**: Katta UI bloklar (Header).


Bu loyiha mening React, TypeScript va zamonaviy frontend texnologiyalaridagi bilimlarimni namoyish etadi. FSD pattern yordamida kodni modulli va scalable qildim, RTK Query bilan API integratsiyasini soddalashtirdim, va Shadcn UI bilan professional UI yaratdim. 

Eslatma: Aslida bu juda core ishlar. Talablardagi barchasi ishlar ortig'i bilan to'liqligicha bajarildi



