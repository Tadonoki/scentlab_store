ScentLab_Store
Serenity in Every Scent


PRD
Project Requirements Document
Website E-Commerce Lilin Aromaterapi dengan Admin Dashboard, CRUD Produk, Neon PostgreSQL, dan WhatsApp Checkout


Item	Keterangan
Nama Project	ScentLab_Store
Jenis Project	Mini e-commerce fullstack untuk penjualan lilin aromaterapi
Versi Dokumen	1.0
Tanggal	29 Mei 2026
Target Platform	Web responsive: desktop, tablet, dan mobile
Tech Stack Utama	Next.js, React, Tailwind CSS, Neon PostgreSQL, Drizzle ORM, Vercel

Catatan desain: PRD ini disesuaikan dengan identitas visual feed Instagram produk: beige, taupe, cream, floral ornament, script font, dan nuansa premium boutique candle store.
 
Daftar Isi
•	1. Overview
•	2. Goals dan Success Metrics
•	3. Scope dan Batasan MVP
•	4. User Roles
•	5. Requirements
•	6. Core Features
•	7. User Flow
•	8. Information Architecture dan Routes
•	9. Architecture
•	10. Database Schema
•	11. API dan Server Actions
•	12. Notification System
•	13. UI/UX Design Guidelines
•	14. Admin Dashboard Requirements
•	15. Security dan Access Control
•	16. Deployment dan Environment Variables
•	17. Testing dan Acceptance Criteria
•	18. Milestone Development Plan
•	19. Future Enhancements
 
1. Overview
ScentLab_Store adalah website e-commerce untuk penjualan produk lilin aromaterapi. Website ini dirancang sebagai toko online sederhana namun profesional, dengan tampilan premium yang selaras dengan identitas visual produk di Instagram. Fokus utama project adalah memudahkan pembeli melihat katalog aroma lilin, memasukkan produk ke keranjang, melakukan checkout, mendapatkan struk otomatis, dan mengonfirmasi pembayaran melalui WhatsApp.
Di sisi owner/admin, sistem menyediakan dashboard untuk mengelola produk, melihat riwayat order, mengubah status order, dan memantau performa toko. Semua data produk dan order disimpan di Neon PostgreSQL sehingga owner dapat menambah, mengedit, dan menghapus produk dari halaman /admin tanpa perlu mengubah kode secara manual.
Masalah yang Ingin Diselesaikan
•	Katalog produk di Instagram belum cukup praktis untuk proses pemesanan yang rapi.
•	Owner membutuhkan tempat untuk mengelola produk secara mandiri tanpa edit kode.
•	Order pembeli perlu tercatat otomatis agar tidak hilang di chat WhatsApp.
•	Pembeli membutuhkan alur checkout yang jelas: pilih produk, isi data, lihat struk, lalu konfirmasi pembayaran.
•	Owner membutuhkan dashboard untuk melihat order baru, pending payment, order selesai, dan total penjualan.
Tujuan Utama
•	Membuat website toko online yang aesthetic, premium, dan responsif.
•	Membuat sistem cart dan checkout yang mudah digunakan pembeli.
•	Menyimpan order ke database sebelum pembeli diarahkan ke WhatsApp.
•	Menyediakan admin dashboard untuk CRUD produk dan manajemen order.
•	Mengirim notifikasi order baru ke owner melalui dashboard dan opsi Telegram Bot.
•	Membuat project siap deploy ke Vercel dan layak dijadikan portfolio fullstack e-commerce.
2. Goals dan Success Metrics
Business Goals
•	Meningkatkan kepercayaan pembeli dengan website yang terlihat profesional dan sesuai branding produk.
•	Mengurangi proses order manual yang berantakan di chat.
•	Membantu owner melihat semua order dalam satu dashboard.
•	Membuat pengelolaan produk menjadi fleksibel melalui halaman admin.
Product Goals
•	Pembeli dapat menyelesaikan alur pemesanan dalam satu halaman tanpa bingung.
•	Admin dapat menambah produk baru dalam waktu kurang dari 1 menit.
•	Order baru langsung tersimpan ke database dengan status Pending Payment.
•	Website tetap nyaman digunakan di mobile karena mayoritas pembeli kemungkinan datang dari Instagram.
Success Metrics
Metric	Target
Checkout Completion	Minimal 80% user yang menekan Checkout dapat menyelesaikan form order.
Admin Efficiency	Admin dapat membuat/edit produk tanpa menyentuh kode.
Order Traceability	100% order yang checkout harus tersimpan di database.
Mobile Usability	Tampilan hero, produk, cart, checkout, dan admin table tetap rapi pada layar mobile.
Notification	Owner menerima notifikasi order baru melalui dashboard dan/atau Telegram.

3. Scope dan Batasan MVP
In Scope - MVP
•	Landing page dengan hero section, produk unggulan, brand story, dan footer.
•	Katalog produk lilin aromaterapi yang diambil dari database Neon PostgreSQL.
•	Cart client-side dengan fitur tambah, kurang, hapus item, dan total harga otomatis.
•	Checkout form: nama pembeli, nomor WhatsApp, alamat, metode pembayaran, dan catatan opsional.
•	Struk/ringkasan order setelah checkout berhasil.
•	WhatsApp confirmation link otomatis berisi detail order.
•	Admin login.
•	Admin dashboard overview.
•	CRUD produk dari halaman admin.
•	Riwayat order dan detail order.
•	Update status order oleh admin.
•	Notifikasi order baru untuk owner melalui dashboard dan opsi Telegram Bot.
•	Deploy ke Vercel dengan environment variables.
Out of Scope - Tidak Wajib untuk Versi Pertama
•	Payment gateway otomatis seperti Midtrans/Xendit.
•	Login/register pembeli.
•	Ongkir otomatis atau integrasi ekspedisi.
•	Upload bukti pembayaran langsung ke website.
•	Multi admin dengan role kompleks.
•	Inventory warehouse detail seperti batch dan rak.
•	Review produk dan rating pembeli.
•	Diskon voucher otomatis.
MVP Principle
Versi pertama harus fokus pada alur bisnis inti: pembeli melihat produk, menambahkan ke cart, checkout, order tersimpan ke database, pembeli konfirmasi via WhatsApp, dan admin dapat mengelola produk serta order. Fitur tambahan boleh ditambahkan setelah alur utama stabil.
4. User Roles
Role	Akses	Catatan
Visitor / Pembeli	Mengakses website publik, melihat produk, menambahkan ke cart, checkout, dan konfirmasi ke WhatsApp.	Tidak perlu login.
Owner / Admin	Login ke /admin, mengelola produk, melihat order, update status order, memantau dashboard.	Wajib login.
System	Menyimpan data order, menghitung total, menghasilkan order code, mengirim notifikasi, dan membuat WhatsApp message.	Berjalan otomatis.

5. Requirements
Functional Requirements
ID	Requirement	Priority
FR-01	Website menampilkan landing page sesuai branding ScentLab_Store.	Must Have
FR-02	Website menampilkan daftar produk aktif dari database.	Must Have
FR-03	Pembeli dapat menambahkan produk ke cart.	Must Have
FR-04	Pembeli dapat mengubah quantity dan menghapus item dari cart.	Must Have
FR-05	Sistem menghitung subtotal dan total order otomatis.	Must Have
FR-06	Pembeli dapat mengisi checkout form.	Must Have
FR-07	Sistem menyimpan order dan order items ke database.	Must Have
FR-08	Sistem membuat order code unik seperti SL-000001.	Must Have
FR-09	Sistem menampilkan struk setelah checkout berhasil.	Must Have
FR-10	Sistem membuat link WhatsApp otomatis untuk konfirmasi pembayaran.	Must Have
FR-11	Admin dapat login ke dashboard.	Must Have
FR-12	Admin dapat melihat overview toko.	Must Have
FR-13	Admin dapat CRUD produk.	Must Have
FR-14	Admin dapat melihat semua order dan detail order.	Must Have
FR-15	Admin dapat mengubah status order.	Must Have
FR-16	Sistem dapat mengirim notifikasi order baru ke Telegram owner.	Should Have
FR-17	Admin dapat filter order berdasarkan status dan tanggal.	Should Have
FR-18	Admin dapat melihat produk terlaris dan revenue trend.	Could Have

Non-Functional Requirements
ID	Area	Requirement
NFR-01	Responsive Design	Website harus rapi di mobile, tablet, dan desktop.
NFR-02	Performance	Halaman utama harus ringan dan cepat dimuat. Gambar produk perlu dioptimasi.
NFR-03	Reliability	Checkout tidak boleh gagal menyimpan order jika form valid dan database aktif.
NFR-04	Security	Route /admin harus dilindungi. Password admin tidak boleh disimpan plain text.
NFR-05	Maintainability	Kode dipisahkan antara UI components, database schema, server actions/API, dan utilities.
NFR-06	Scalability	Database menggunakan Neon PostgreSQL agar mudah dikembangkan di masa depan.
NFR-07	Data Integrity	Order item harus menyimpan product_name dan price snapshot agar riwayat tetap valid saat produk diedit.

6. Core Features
6.1 Public Website
•	Hero Section: menampilkan brand name ScentLab_Store, tagline Serenity in Every Scent, dan tombol Mulai Belanja serta Chat CS.
•	Curated Collections: menampilkan beberapa varian lilin seperti Sweet Dreams, Calm Horizon, Earth Awakening, Sunset Beach, Royal Arabian, dan Summer Bouquet.
•	Product Catalog: daftar produk dari database lengkap dengan gambar, scent notes, deskripsi, harga, stok, dan tombol Add to Cart.
•	Cart: ringkasan pesanan dengan quantity, subtotal, total, dan tombol Checkout.
•	Checkout Form: input data pembeli dan metode pembayaran.
•	Receipt: struk otomatis berisi kode order, data pembeli, item, total, status, dan tombol konfirmasi WhatsApp.
•	WhatsApp CTA: chat customer service dengan nomor 087868403642 melalui format internasional 6287868403642.
6.2 Admin Dashboard
•	Login admin.
•	Dashboard overview: total revenue, total orders, pending payment, completed orders, total products, dan recent orders.
•	Product Management: tambah, edit, hapus, aktivasi/nonaktif produk, update harga, stok, gambar, aroma notes, dan badge.
•	Order Management: lihat semua order, detail order, update status, dan filter status.
•	Notification Center: daftar notifikasi order baru atau pending payment.
6.3 Notification System
•	Order baru membuat notifikasi di dashboard admin.
•	Opsi integrasi Telegram Bot untuk mengirim pesan otomatis ke owner.
•	Notifikasi dibedakan berdasarkan tipe: ORDER_BARU, PENDING_PAYMENT, PAID, PROCESSING, COMPLETED, CANCELLED.
7. User Flow
7.1 Alur Pembeli
1.	Pembeli membuka landing page ScentLab_Store.
2.	Pembeli menekan tombol Mulai Belanja atau scroll ke section produk.
3.	Pembeli melihat variasi aroma lilin.
4.	Pembeli menekan Add to Cart pada produk yang diinginkan.
5.	Pembeli membuka cart dan mengecek jumlah item serta total harga.
6.	Pembeli menekan Checkout.
7.	Pembeli mengisi nama, nomor WhatsApp, alamat, metode pembayaran, dan catatan opsional.
8.	Sistem memvalidasi form dan menyimpan order ke database.
9.	Sistem menampilkan struk dengan status Pending Payment.
10.	Pembeli menekan Konfirmasi via WhatsApp.
11.	WhatsApp terbuka dengan pesan otomatis berisi detail order.
12.	Pembeli mengirim bukti pembayaran ke owner melalui WhatsApp.
7.2 Alur Admin
13.	Admin membuka /admin/login.
14.	Admin login menggunakan email dan password.
15.	Admin masuk ke /admin/dashboard.
16.	Admin melihat order terbaru dan statistik toko.
17.	Jika ada order baru, admin membuka detail order.
18.	Admin menunggu bukti pembayaran dari WhatsApp.
19.	Setelah bukti valid, admin mengubah status dari Pending Payment menjadi Paid atau Processing.
20.	Jika pesanan selesai, admin mengubah status menjadi Completed.
21.	Admin dapat menambah atau mengedit produk dari /admin/products.
7.3 Alur Create Order - Ringkas
Pembeli Checkout
  -> Validasi form dan cart
  -> Buat order_code unik
  -> Simpan data ke tabel orders
  -> Simpan setiap item ke tabel order_items
  -> Buat notification ORDER_BARU
  -> Kirim Telegram message ke owner (opsional)
  -> Tampilkan struk
  -> Generate link WhatsApp confirmation
8. Information Architecture dan Routes
Route	Access	Description
/	Public	Landing page, hero, featured products, brand story, cart preview, footer.
/products	Public	Daftar semua produk dan filter aroma/kategori jika dibutuhkan.
/checkout	Public	Halaman/form checkout jika tidak dibuat modal/section di homepage.
/order/[orderCode]	Public	Struk order dan tombol konfirmasi WhatsApp.
/admin/login	Admin	Halaman login admin.
/admin/dashboard	Protected	Overview penjualan dan recent orders.
/admin/products	Protected	Tabel produk dan aksi create/edit/delete.
/admin/products/new	Protected	Form tambah produk.
/admin/products/[id]/edit	Protected	Form edit produk.
/admin/orders	Protected	Tabel semua order, filter, dan search.
/admin/orders/[id]	Protected	Detail order dan update status.
/admin/settings	Protected	Pengaturan nomor WhatsApp, metode pembayaran, dan identitas toko.

Struktur Folder Rekomendasi
app/
  (public)/
    page.tsx
    products/page.tsx
    order/[orderCode]/page.tsx
  admin/
    login/page.tsx
    dashboard/page.tsx
    products/page.tsx
    products/new/page.tsx
    products/[id]/edit/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
  api/
    telegram/route.ts
components/
  public/
  admin/
  ui/
lib/
  db/
    schema.ts
    index.ts
  actions/
  auth.ts
  whatsapp.ts
  telegram.ts
  format.ts
9. Architecture
High-Level Architecture
Layer	Technology	Responsibility
Frontend	Next.js + React + Tailwind CSS	Menampilkan UI public store dan admin dashboard.
Backend Logic	Next.js Server Actions / Route Handlers	Validasi form, create order, CRUD produk, update status, dan integrasi notifikasi.
Database	Neon PostgreSQL	Menyimpan produk, order, order item, admin user, notification, dan setting toko.
ORM	Drizzle ORM	Mendefinisikan schema, query, migration, dan akses database dengan TypeScript.
Auth	Auth.js / Custom Admin Auth	Melindungi halaman admin.
Notification	Telegram Bot API	Mengirim notifikasi order baru ke owner.
Checkout Confirmation	WhatsApp deeplink	Mengarahkan pembeli ke WhatsApp dengan pesan otomatis.
Deployment	Vercel	Hosting aplikasi Next.js dan environment variables.

Sequence Diagram - Checkout
sequenceDiagram
    participant Buyer as Pembeli
    participant UI as Website Next.js
    participant Server as Server Action / API
    participant DB as Neon PostgreSQL
    participant Notif as Telegram Bot
    participant WA as WhatsApp

    Buyer->>UI: Add product to cart
    Buyer->>UI: Submit checkout form
    UI->>Server: createOrder(payload)
    Server->>Server: Validate cart and buyer data
    Server->>DB: Insert orders
    Server->>DB: Insert order_items
    Server->>DB: Insert notifications
    Server->>Notif: Send owner notification
    Server-->>UI: Return order code and receipt data
    UI-->>Buyer: Show receipt
    Buyer->>WA: Click confirmation link
Data Flow Notes
•	Cart disimpan di client state/localStorage agar tidak perlu login pembeli.
•	Harga order item menggunakan snapshot price saat checkout, bukan harga terbaru produk.
•	Revenue dashboard dihitung dari order dengan status Paid, Processing, atau Completed, bukan Pending Payment.
•	Order baru default status Pending Payment.
•	Admin update status setelah mengecek bukti pembayaran di WhatsApp.
10. Database Schema
Database menggunakan Neon PostgreSQL. Schema berikut dirancang untuk MVP namun tetap mudah dikembangkan untuk fitur lanjutan seperti upload bukti pembayaran, voucher, atau payment gateway.
ERD Ringkas
erDiagram
    users ||--o{ orders : manages
    categories ||--o{ products : contains
    products ||--o{ product_images : has
    products ||--o{ order_items : sold_as
    orders ||--o{ order_items : contains
    orders ||--o{ notifications : triggers
    settings ||--o{ orders : config_reference
Tabel: users
Column	Type	Constraint	Description
id	uuid	PK	ID user/admin.
name	varchar(120)	not null	Nama admin.
email	varchar(180)	unique, not null	Email login admin.
password_hash	text	not null	Password yang sudah di-hash.
role	varchar(30)	default admin	Role user. MVP cukup admin.
created_at	timestamp	default now()	Tanggal dibuat.
updated_at	timestamp	default now()	Tanggal update.

Tabel: categories
Column	Type	Constraint	Description
id	uuid	PK	ID kategori.
name	varchar(120)	not null	Nama kategori, contoh Lilin Aromaterapi.
slug	varchar(150)	unique, not null	Slug kategori.
description	text	nullable	Deskripsi kategori.
is_active	boolean	default true	Status tampil/tidak.
created_at	timestamp	default now()	Tanggal dibuat.

Tabel: products
Column	Type	Constraint	Description
id	uuid	PK	ID produk.
category_id	uuid	FK categories.id	Kategori produk.
name	varchar(160)	not null	Nama produk, contoh Sweet Dreams.
slug	varchar(180)	unique, not null	Slug untuk URL.
scent_notes	text	not null	Aroma notes, contoh Jasmine | Ylang-ylang | Vanilla.
description	text	not null	Deskripsi produk.
price	integer	not null	Harga dalam Rupiah.
stock	integer	default 0	Stok tersedia.
image_url	text	nullable	URL gambar utama produk.
badge	varchar(80)	nullable	Label seperti Best Seller atau New.
is_featured	boolean	default false	Tampil di curated collection.
is_active	boolean	default true	Tampil/tidak di katalog.
created_at	timestamp	default now()	Tanggal dibuat.
updated_at	timestamp	default now()	Tanggal update.

Tabel: product_images
Column	Type	Constraint	Description
id	uuid	PK	ID gambar.
product_id	uuid	FK products.id	Relasi ke produk.
image_url	text	not null	URL gambar.
alt_text	varchar(200)	nullable	Alt text untuk aksesibilitas.
sort_order	integer	default 0	Urutan gambar.
created_at	timestamp	default now()	Tanggal dibuat.

Tabel: orders
Column	Type	Constraint	Description
id	uuid	PK	ID order.
order_code	varchar(30)	unique, not null	Kode order, contoh SL-000001.
buyer_name	varchar(160)	not null	Nama pembeli.
buyer_phone	varchar(30)	not null	Nomor WhatsApp pembeli.
buyer_address	text	not null	Alamat lengkap.
payment_method	varchar(60)	not null	Transfer Bank, DANA, OVO, COD, dll.
notes	text	nullable	Catatan pembeli.
subtotal_amount	integer	not null	Subtotal sebelum biaya lain.
shipping_amount	integer	default 0	Ongkir manual jika digunakan.
total_amount	integer	not null	Total akhir.
status	varchar(40)	default PENDING_PAYMENT	Status order.
created_at	timestamp	default now()	Tanggal order dibuat.
updated_at	timestamp	default now()	Tanggal status/order update.

Tabel: order_items
Column	Type	Constraint	Description
id	uuid	PK	ID item order.
order_id	uuid	FK orders.id	Relasi ke order.
product_id	uuid	FK products.id	Relasi ke produk.
product_name	varchar(160)	not null	Snapshot nama produk saat checkout.
scent_notes	text	nullable	Snapshot aroma notes.
quantity	integer	not null	Jumlah beli.
price	integer	not null	Snapshot harga satuan.
subtotal	integer	not null	quantity * price.

Tabel: notifications
Column	Type	Constraint	Description
id	uuid	PK	ID notifikasi.
order_id	uuid	FK orders.id	Order terkait.
type	varchar(60)	not null	ORDER_BARU, PAYMENT_CHECK, dll.
title	varchar(180)	not null	Judul notifikasi.
message	text	not null	Isi notifikasi.
is_read	boolean	default false	Status dibaca admin.
created_at	timestamp	default now()	Tanggal notifikasi dibuat.

Tabel: settings
Column	Type	Constraint	Description
id	uuid	PK	ID settings.
store_name	varchar(160)	not null	Nama toko.
whatsapp_number	varchar(30)	not null	Nomor CS/owner.
instagram_url	text	nullable	Link Instagram.
bank_account_text	text	nullable	Informasi rekening transfer.
telegram_chat_id	varchar(120)	nullable	Chat ID owner untuk Telegram.
created_at	timestamp	default now()	Tanggal dibuat.
updated_at	timestamp	default now()	Tanggal update.

Order Status
Status	Description
PENDING_PAYMENT	Order dibuat, pembeli belum mengirim atau belum divalidasi bukti pembayaran.
PAID	Pembayaran sudah valid.
PROCESSING	Pesanan sedang diproses/dikemas.
COMPLETED	Pesanan selesai.
CANCELLED	Order dibatalkan.

11. API dan Server Actions
Implementasi dapat menggunakan Next.js Server Actions untuk operasi form dan Route Handlers untuk kebutuhan API tertentu. Tabel berikut menjelaskan endpoint/action yang direkomendasikan.
Name	Type	Access	Description
getActiveProducts()	Server Query	Public	Mengambil produk aktif untuk katalog.
createOrder(payload)	Server Action	Public	Validasi checkout, simpan order, simpan order_items, buat notifikasi.
getOrderByCode(orderCode)	Server Query	Public	Menampilkan struk order.
loginAdmin(credentials)	Server Action	Public/Admin	Autentikasi admin.
createProduct(payload)	Server Action	Protected	Tambah produk baru.
updateProduct(id, payload)	Server Action	Protected	Edit produk.
deleteProduct(id)	Server Action	Protected	Hapus produk atau set is_active false.
getAdminDashboardStats()	Server Query	Protected	Mengambil total revenue, order, pending, completed, product count.
getOrders(filter)	Server Query	Protected	Mengambil semua order dengan filter status/tanggal/search.
updateOrderStatus(orderId, status)	Server Action	Protected	Mengubah status order dan membuat notification log.
sendTelegramNotification(order)	Utility/API	Server Only	Mengirim pesan order baru ke Telegram owner.

Validation Rules
Field	Rule
buyer_name	Required, minimal 2 karakter.
buyer_phone	Required, hanya angka/plus, validasi panjang 10-15 digit.
buyer_address	Required, minimal 10 karakter.
payment_method	Required, harus salah satu dari metode yang tersedia.
cart	Required, minimal 1 item.
quantity	Harus lebih dari 0 dan tidak boleh melebihi stok jika stok diberlakukan.
product price	Harga harus diambil ulang dari database saat checkout untuk mencegah manipulasi client.

12. Notification System
Jenis Notifikasi
Type	Trigger	Receiver	Channel
ORDER_BARU	Saat order berhasil dibuat.	Owner/Admin	Dashboard + Telegram
PENDING_PAYMENT	Order belum dibayar setelah dibuat.	Admin	Dashboard badge
PAYMENT_CHECK	Pembeli diarahkan untuk kirim bukti pembayaran.	Owner	WhatsApp manual dari pembeli
PAID	Admin menandai pembayaran valid.	Admin	Dashboard log
PROCESSING	Admin memproses pesanan.	Admin	Dashboard log
COMPLETED	Pesanan selesai.	Admin	Dashboard log
CANCELLED	Order dibatalkan.	Admin	Dashboard log

Format Pesan Telegram Owner
ORDER BARU - ScentLab_Store
Kode Order: SL-000001
Nama: [buyer_name]
No WA: [buyer_phone]
Total: Rp[total_amount]
Metode: [payment_method]
Status: PENDING_PAYMENT

Produk:
- [product_name] x[quantity] = Rp[subtotal]

Cek dashboard: [SITE_URL]/admin/orders/[order_id]
Format Pesan WhatsApp untuk Pembeli
Halo ScentLab_Store, saya ingin konfirmasi pesanan.

Kode Order: SL-000001
Nama: [buyer_name]
No WA: [buyer_phone]
Alamat: [buyer_address]

Pesanan:
- [product_name] x[quantity] = Rp[subtotal]

Total: Rp[total_amount]
Metode Pembayaran: [payment_method]

Saya akan mengirim bukti pembayaran.
13. UI/UX Design Guidelines
Desain website harus mengikuti tampilan visual produk ScentLab di Instagram: warm beige, taupe, nude cream, border tipis, floral ornament, script typography, dan nuansa premium yang tenang. Hindari desain futuristik/AI, neon, dan glassmorphism berat.
Brand Personality
•	Elegant: tampilan anggun seperti boutique candle/perfume brand.
•	Calm: memberi kesan relaksasi dan aromatherapy.
•	Premium: spacing rapi, warna lembut, typography classy.
•	Feminine classic: menggunakan floral ornament dan script title secara proporsional.
•	Trustworthy: checkout jelas, harga jelas, kontak WhatsApp jelas.
Color Palette
Name	Hex	Usage
Warm Beige	#D8CCBC	Background utama, section soft.
Soft Taupe	#CDBEAE	Aksen background, border decorative.
Nude Cream	#F5EFE7	Card, form, area checkout.
Dark Brown	#3A2C24	Heading dan primary text.
Near Black	#1F1B18	Text penting dan border tipis.
Soft Gold	#B9935A	Button, hover, accent premium.

Typography Recommendation
Element	Font Direction	Usage
Logo / Main Title	Great Vibes, Alex Brush, Allura, atau font script serupa	Untuk brand name dan collection title.
Heading	Playfair Display, Cormorant Garamond, Libre Baskerville	Untuk judul section dan product names.
Body	Lora, Cormorant Garamond, Inter, atau Poppins	Untuk deskripsi produk dan UI text.
Admin Dashboard	Inter atau Poppins	Lebih clean dan mudah dibaca untuk table dan form.

Public Website Layout
Section	Content
Hero	Brand name, tagline, intro pendek, Mulai Belanja, Chat CS, visual candle premium.
Curated Collections	3-6 produk unggulan dengan card elegan dan border tipis.
Brand Story	Narasi singkat tentang ketenangan, aroma, dan kualitas produk.
All Products	Grid produk responsive dengan Add to Cart.
Cart Drawer/Section	Ringkasan item, quantity control, total, checkout.
Checkout	Form pembeli dan metode pembayaran.
Receipt	Kode order, item, total, instruksi pembayaran, tombol WhatsApp.
Footer	Brand, WhatsApp, Instagram, navigasi kecil.

Mobile UX Rules
•	Navbar mobile harus menggunakan hamburger dan menampilkan Produk, Cara Order, Chat CS, dan Cart.
•	Hero text tidak boleh terlalu kecil; CTA harus mudah diklik.
•	Product grid berubah menjadi 1 kolom di layar kecil.
•	Cart sebaiknya tampil sebagai bottom sheet/drawer di mobile.
•	Admin tables di mobile harus dapat scroll horizontal atau berubah menjadi card list.
•	Tombol Checkout dan WhatsApp harus berada di area yang mudah dijangkau.
14. Admin Dashboard Requirements
Overview Cards
Card	Definition
Total Revenue	Total nilai order dengan status Paid/Processing/Completed.
Total Orders	Jumlah semua order.
Pending Payment	Jumlah order dengan status Pending Payment.
Completed Orders	Jumlah order selesai.
Total Products	Jumlah produk aktif.
Low Stock Products	Produk dengan stok rendah jika stok digunakan.

Product CRUD Fields
Field	Description	Required
name	Nama produk, contoh Sweet Dreams.	Required
category	Kategori produk.	Required
scent_notes	Aroma notes, contoh Jasmine | Ylang-ylang | Vanilla.	Required
description	Deskripsi singkat.	Required
price	Harga produk.	Required
stock	Jumlah stok.	Required/Optional
image_url	URL gambar produk.	Required untuk tampilan rapi
badge	Label produk seperti Best Seller.	Optional
is_featured	Tampil di curated collection.	Optional
is_active	Status produk tampil/tidak.	Required

Order Management
•	Tabel order menampilkan order code, nama pembeli, nomor WhatsApp, total, metode pembayaran, status, tanggal, dan action detail.
•	Detail order menampilkan data pembeli, alamat, item order, total, dan timeline status.
•	Admin dapat mengubah status order dari Pending Payment ke Paid, Processing, Completed, atau Cancelled.
•	Update status harus memperbarui updated_at dan menambahkan log/notifikasi internal.
•	Order tidak boleh terhapus permanen pada MVP; jika dibatalkan gunakan status Cancelled.
15. Security dan Access Control
Area	Requirement
Admin Route Protection	Semua route /admin kecuali /admin/login harus protected.
Password Hashing	Password admin harus disimpan sebagai hash, bukan plain text.
Server-Side Authorization	CRUD produk dan update order harus dicek di server, bukan hanya di UI.
Environment Variables	DATABASE_URL, AUTH_SECRET, TELEGRAM_BOT_TOKEN tidak boleh di-commit ke GitHub.
Input Validation	Semua input form harus divalidasi di server.
Price Integrity	Harga order harus diambil dari database saat checkout, bukan dari data client semata.
SQL Safety	Gunakan ORM/query builder untuk mengurangi risiko SQL injection.

16. Deployment dan Environment Variables
Deployment Flow
22.	Buat project Next.js lokal.
23.	Install Tailwind CSS dan UI dependencies.
24.	Setup Neon PostgreSQL dan copy DATABASE_URL.
25.	Setup Drizzle schema dan migration.
26.	Buat seed data produk awal.
27.	Buat frontend public store.
28.	Buat admin dashboard dan auth.
29.	Integrasi create order, CRUD product, dan order management.
30.	Test lokal secara end-to-end.
31.	Push repository ke GitHub.
32.	Import repository ke Vercel.
33.	Masukkan environment variables di Vercel.
34.	Deploy production dan lakukan final QA.
Environment Variables
Variable	Description	Priority
DATABASE_URL	Connection string Neon PostgreSQL.	Required
AUTH_SECRET	Secret untuk session/auth.	Required
NEXT_PUBLIC_SITE_URL	URL website production, contoh https://scentlab-store.vercel.app.	Required
ADMIN_EMAIL	Email admin awal jika menggunakan seed/simple auth.	Required untuk MVP sederhana
ADMIN_PASSWORD	Password admin awal untuk seed, jangan dipakai hardcode permanen.	Optional
TELEGRAM_BOT_TOKEN	Token bot Telegram untuk notifikasi owner.	Optional/Should Have
TELEGRAM_CHAT_ID	Chat ID owner atau grup admin.	Optional/Should Have
NEXT_PUBLIC_WHATSAPP_NUMBER	Nomor WhatsApp CS format 6287868403642.	Required

17. Testing dan Acceptance Criteria
Functional Test Cases
ID	Scenario	Steps	Expected Result
TC-01	Load homepage	Hero, produk, CTA, dan footer tampil rapi.	Pass jika tidak ada layout rusak.
TC-02	Add to cart	Klik Add to Cart pada produk.	Item masuk cart dan total berubah.
TC-03	Update quantity	Tambah/kurang quantity di cart.	Subtotal dan total update benar.
TC-04	Checkout valid	Isi form lengkap dan submit.	Order tersimpan dan struk tampil.
TC-05	Checkout invalid	Kosongkan field wajib.	Error message tampil dan order tidak dibuat.
TC-06	WhatsApp confirmation	Klik tombol konfirmasi.	WhatsApp terbuka dengan pesan order otomatis.
TC-07	Admin login	Login dengan kredensial valid.	Masuk ke dashboard.
TC-08	Create product	Admin tambah produk.	Produk muncul di katalog.
TC-09	Edit product	Admin edit harga/deskripsi.	Data berubah di admin dan public.
TC-10	Update order status	Admin ubah status order.	Status berubah dan tersimpan.
TC-11	Responsive mobile	Buka di layar mobile.	Navbar, product cards, cart, dan checkout rapi.
TC-12	Telegram notification	Order baru dibuat.	Owner menerima pesan Telegram jika env aktif.

Acceptance Criteria MVP
•	Website public dapat digunakan pembeli dari landing page sampai WhatsApp confirmation.
•	Order selalu tersimpan di database sebelum WhatsApp dibuka.
•	Admin dapat melakukan CRUD produk dari /admin.
•	Admin dapat melihat riwayat order dan update status.
•	Tampilan mengikuti style ScentLab: beige, taupe, cream, script/serif typography, floral ornament, premium boutique.
•	Website responsif untuk mobile dan desktop.
•	Project berhasil di-push ke GitHub dan deploy ke Vercel.
18. Milestone Development Plan
Phase	Focus	Output	Estimate
Phase 1	PRD dan setup project	Final PRD, setup Next.js, Tailwind, struktur folder.	0.5-1 hari
Phase 2	Frontend public store	Hero, product section, cart UI, checkout UI, receipt UI, responsive.	1-2 hari
Phase 3	Database dan ORM	Neon setup, Drizzle schema, migration, seed produk.	0.5-1 hari
Phase 4	Checkout integration	Create order, order_items, WhatsApp link, struk dynamic.	1 hari
Phase 5	Admin auth dan dashboard	Login admin, dashboard overview, protected routes.	1 hari
Phase 6	Product CRUD	Tambah/edit/hapus produk dari admin.	1 hari
Phase 7	Order management	Order list, detail, update status.	1 hari
Phase 8	Notification	Dashboard notification dan Telegram Bot.	0.5-1 hari
Phase 9	QA dan deployment	Test mobile, push GitHub, deploy Vercel, env setup.	0.5-1 hari

19. Future Enhancements
•	Payment gateway otomatis dengan Midtrans/Xendit.
•	Upload bukti pembayaran langsung di website.
•	Ongkir otomatis dengan API ekspedisi.
•	Customer account dan riwayat pembelian.
•	Voucher dan discount code.
•	Product reviews dan rating.
•	Admin role multi-user.
•	Export order ke Excel/CSV.
•	CMS sederhana untuk banner dan brand story.
•	Analytics conversion dari Instagram ke checkout.
20. Appendix
Sample Product Seed Data
Product	Scent Notes	Description	Badge
Sweet Dreams	Jasmine | Ylang-ylang | Vanilla	Perpaduan aroma manis dan lembut untuk suasana nyaman.	Best Seller
Calm Horizon	Lavender | Eucalyptus | Lemongrass	Aroma segar dan menenangkan untuk relaksasi.	Relax
Earth Awakening	Lemongrass | Patchouli | Peppermint	Aroma earthy dan segar untuk membangkitkan semangat.	Fresh
Sunset Beach	Ocean Breeze | Lavender | Vanilla	Aroma pantai senja yang lembut dan menenangkan.	New
Royal Arabian	Oud | Rose | Sandalwood	Aroma mewah Timur Tengah yang elegan.	Premium
Summer Bouquet	Gardenia | Ylang-ylang | White Flower	Aroma bunga musim panas yang lembut dan romantis.	Floral

Recommended Initial Payment Methods
•	Transfer Bank
•	DANA
•	OVO
•	COD jika owner ingin menerima bayar di tempat.
Definition of Done
•	Semua halaman MVP selesai dan tidak ada error console kritis.
•	Database Neon production tersambung dari Vercel.
•	CRUD produk berjalan dari admin.
•	Checkout membuat order di database.
•	WhatsApp link berisi pesan yang benar.
•	Owner dapat melihat order baru di admin dashboard.
•	Website sudah responsive dan sesuai visual brand.
