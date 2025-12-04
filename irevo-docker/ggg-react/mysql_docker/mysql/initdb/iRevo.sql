-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- ホスト: mysql-db
-- 生成日時: 2025 年 11 月 12 日 16:05
-- サーバのバージョン： 9.5.0
-- PHP のバージョン: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+09:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `iRevo`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `ApplicationProcess`
--

CREATE TABLE `ApplicationProcess` (
  `id` int NOT NULL,
  `job_id` int NOT NULL,
  `application_method` text NOT NULL,
  `selection_flow` text NOT NULL,
  `interview_location` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `ApplicationProcess`
--

INSERT INTO `ApplicationProcess` (`id`, `job_id`, `application_method`, `selection_flow`, `interview_location`) VALUES
(1, 1, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '東京都千代田区本社'),
(2, 2, 'WEB応募、人材紹介会社', '書類選考→一次面接→最終面接', '東京都世田谷区本社'),
(3, 3, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '神奈川県川崎市本社'),
(4, 4, 'WEB応募、人材紹介会社', '書類選考→一次面接→プログラミング面接→最終面接', '神奈川県横浜市本社'),
(5, 5, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '大阪府門真市本社'),
(6, 6, 'WEB応募、人材紹介会社', '書類選考→一次面接→クリエイティブ面接→最終面接', '大阪府大阪市本社'),
(7, 7, 'WEB応募、人材紹介会社', '書類選考→一次面接→マーケティング面接→最終面接', '兵庫県尼崎市本社'),
(8, 8, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '兵庫県神戸市本社'),
(9, 9, 'WEB応募、人材紹介会社', '書類選考→一次面接→企画面接→最終面接', '愛知県名古屋市本社'),
(10, 10, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '愛知県豊田市本社'),
(11, 11, 'WEB応募、人材紹介会社', '書類選考→一次面接→AI技術面接→最終面接', '福岡県福岡市本社'),
(12, 12, 'WEB応募、人材紹介会社', '書類選考→一次面接→最終面接', '福岡県飯塚市本社'),
(13, 13, 'WEB応募、人材紹介会社', '書類選考→一次面接→マーケティング面接→最終面接', '北海道札幌市本社'),
(14, 14, 'WEB応募、人材紹介会社', '書類選考→一次面接→セキュリティ面接→最終面接', '北海道札幌市本社'),
(15, 15, 'WEB応募、公共職業安定所', '書類選考→一次面接→技術面接→最終面接', '宮城県仙台市本社'),
(16, 16, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '宮城県にかほ市本社'),
(17, 17, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '埼玉県さいたま市本社'),
(18, 18, 'WEB応募、人材紹介会社', '書類選考→一次面接→クリエイティブ面接→最終面接', '埼玉県草加市本社'),
(19, 19, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '千葉県千葉市本店'),
(20, 20, 'WEB応募、人材紹介会社', '書類選考→一次面接→店舗見学→最終面接', '千葉県美浜区本社'),
(21, 21, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '群馬県前橋市本店'),
(22, 22, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '群馬県太田市本社'),
(23, 23, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '栃木県宇都宮市本店'),
(24, 24, 'WEB応募、人材紹介会社', '書類選考→一次面接→商品開発面接→最終面接', '栃木県清原工業団地工場'),
(25, 25, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '山梨県甲府市本店'),
(26, 26, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '山梨県南都留郡本社'),
(27, 27, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '長野県松本市本店'),
(28, 28, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '長野県諏訪市本社'),
(29, 29, 'WEB応募、銀行窓口', '書類選考→一次面接→最終面接', '新潟県新潟市本店'),
(30, 30, 'WEB応募、人材紹介会社', '書類選考→一次面接→技術面接→最終面接', '新潟県新潟市本社');

-- --------------------------------------------------------

--
-- テーブルの構造 `Benefits`
--

CREATE TABLE `Benefits` (
  `id` int NOT NULL,
  `job_id` int NOT NULL,
  `insurance` varchar(255) NOT NULL,
  `benefits_system` text NOT NULL,
  `training` tinyint(1) NOT NULL,
  `training_details` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `Benefits`
--

INSERT INTO `Benefits` (`id`, `job_id`, `insurance`, `benefits_system`, `training`, `training_details`) VALUES
(1, 1, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、社宅制度、PC貸与、書籍購入費補助', 1, '新入社員研修、JavaScript研修、AWS研修、資格取得支援（AWS認定）'),
(2, 2, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、社宅制度、副業OK、書籍購入費補助', 1, '新入社員研修、モバイルアプリ開発研修、iOS/Android研修'),
(3, 3, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、システム開発ツール支給', 1, '新入社員研修、C++研修、OpenCV研修、機械学習研修'),
(4, 4, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、高性能PC支給、オンライン学習支援', 1, '新入社員研修、ゲーム開発研修、Unity研修、3DCG研修'),
(5, 5, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、家電量販店割引', 1, '新入社員研修、電子回路設計研修、制御システム研修'),
(6, 6, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、ゲーム機器貸与、クリエイティブツール支給', 1, '新入社員研修、ゲーム企画研修、UI/UXデザイン研修'),
(7, 7, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、マーケティングツール支給', 1, '新入社員研修、デジタルマーケティング研修、Google Analytics研修'),
(8, 8, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、通信機器支給', 1, '新入社員研修、ネットワーク構築研修、セキュリティ研修'),
(9, 9, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、社用車貸与、営業支援ツール支給', 1, '新入社員研修、企画営業研修、プレゼンテーション研修'),
(10, 10, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、自動車工場見学費支給', 1, '新入社員研修、自動車システム研修、組込みソフト開発研修'),
(11, 11, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、高性能PC支給、学会参加費補助', 1, '新入社員研修、AI・機械学習研修、Python研修、論文執筆支援'),
(12, 12, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、通信機器支給、テレワーク環境整備費', 1, '新入社員研修、通信技術研修、5G技術研修'),
(13, 13, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、マーケティングツール支給', 1, '新入社員研修、Webマーケティング研修、SNS運用研修'),
(14, 14, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、セキュリティツール支給、資格手当', 1, '新入社員研修、情報セキュリティ研修、CISSP資格取得支援'),
(15, 15, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、通信費補助', 1, '新入社員研修、システム開発研修、データベース研修'),
(16, 16, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、測定機器支給、学会参加費補助', 1, '新入社員研修、計測技術研修、品質管理研修'),
(17, 17, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、オフィス環境充実', 1, '新入社員研修、システム運用研修、クラウド技術研修'),
(18, 18, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、デザインソフト支給', 1, '新入社員研修、Webデザイン研修、UI/UXデザイン研修'),
(19, 19, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、金融系資格手当', 1, '新入社員研修、金融システム研修、FinTech研修'),
(20, 20, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、小売業界研修費支給', 1, '新入社員研修、POSシステム研修、店舗運営システム研修'),
(21, 21, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、銀行系資格手当', 1, '新入社員研修、銀行業務研修、コンプライアンス研修'),
(22, 22, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、通信機器支給、テクニカル資格手当', 1, '新入社員研修、通信技術研修、ネットワーク構築研修'),
(23, 23, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、銀行系資格手当', 1, '新入社員研修、銀行業務研修、融資審査研修'),
(24, 24, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、研究開発費補助', 1, '新入社員研修、商品開発研修、材料工学研修'),
(25, 25, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、銀行系資格手当', 1, '新入社員研修、銀行業務研修、資産運用研修'),
(26, 26, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、観光業界研修費支給', 1, '新入社員研修、システム開発研修、観光業界知識研修'),
(27, 27, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、銀行系資格手当', 1, '新入社員研修、銀行業務研修、投資信託研修'),
(28, 28, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、精密機器研修費支給', 1, '新入社員研修、システム開発研修、光学技術研修'),
(29, 29, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、銀行系資格手当', 1, '新入社員研修、銀行業務研修、地域金融研修'),
(30, 30, '健康保険、厚生年金、雇用保険、労災保険', '退職金制度、慶弔見舞金、PC貸与、IoT機器支給', 1, '新入社員研修、IoT技術研修、組込みシステム研修');

-- --------------------------------------------------------

--
-- テーブルの構造 `calendarEvents`
--

CREATE TABLE `calendarEvents` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `Companies_id` int NOT NULL,
  `event_date` date NOT NULL,
  `event_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `calendarEvents`
--

INSERT INTO `calendarEvents` (`id`, `user_id`, `Companies_id`, `event_date`, `event_text`, `created_at`) VALUES
(22, 1, 1, '2025-10-30', '面接練習', '2025-10-23 03:15:27'),
(23, 1, 1, '2025-10-30', '面接練習本番', '2025-10-23 05:08:26'),
(24, 1, 1, '2025-10-30', 'ああ', '2025-10-23 05:13:45'),
(25, 1, 1, '2025-10-30', '12 : 00 からインターン', '2025-10-23 05:15:13'),
(26, 1, 1, '2025-10-30', '内定式', '2025-10-23 05:57:28'),
(27, 1, 1, '2025-10-31', 'ハロウィン', '2025-10-23 06:42:03');

-- --------------------------------------------------------

CREATE TABLE career_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  training_content VARCHAR(255),
  part_time_experience VARCHAR(255),
  internship_experience VARCHAR(255)
);

--
-- テーブルの構造 `chart`
--

CREATE TABLE `chart` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `chart_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `chart_text` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `chart`
--

INSERT INTO `chart` (`id`, `user_id`, `chart_title`, `chart_text`) VALUES
(11, 1, 'Friendly', 'Friendlyタイプ');

-- --------------------------------------------------------

--
-- テーブルの構造 `Companies`
--

CREATE TABLE `Companies` (
  `id` int NOT NULL,
  `c_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `founded_year` int DEFAULT NULL,
  `capital` decimal(10,0) DEFAULT NULL,
  `employee_count` int DEFAULT NULL,
  `description` text,
  `homepage_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `Companies`
--

INSERT INTO `Companies` (`id`, `c_name`, `location`, `founded_year`, `capital`, `employee_count`, `description`, `homepage_url`) VALUES
(1, '株式会社NTTドコモ', '東京都千代田区永田町2-11-1 山王パークタワー', 1991, 9496000000, 8400, 'モバイル通信サービス', 'https://www.nttdocomo.co.jp/'),
(2, '楽天グループ株式会社', '東京都世田谷区玉川1-14-1 楽天クリムゾンハウス', 1997, 2055000000, 28000, 'インターネットサービス', 'https://www.rakuten.co.jp/'),
(3, '富士通株式会社', '神奈川県川崎市中原区上小田中4-1-1', 1935, 3246000000, 126000, 'ICTソリューション', 'https://www.fujitsu.com/'),
(4, '株式会社DeNA', '神奈川県横浜市西区みなとみらい2-3-3 クイーンズタワーB', 1999, 1030000000, 2500, 'インターネット・モバイルサービス', 'https://dena.com/'),
(5, 'パナソニック株式会社', '大阪府門真市大字門真1006番地', 1918, 2590000000, 240000, 'エレクトロニクス・通信機器', 'https://www.panasonic.com/'),
(6, '株式会社コナミホールディングス', '大阪府大阪市中央区北浜4-5-33 住友ビル', 1969, 4700000000, 10000, 'エンターテインメント・スポーツ事業', 'https://www.konami.com/'),
(7, '株式会社MonotaRO', '兵庫県尼崎市竹谷町2-183', 2000, 100000000, 1500, 'Eコマース・間接資材通販', 'https://www.monotaro.com/'),
(8, '川崎重工業株式会社', '兵庫県神戸市中央区東川崎町1-1-3', 1896, 1045000000, 36000, '重工業・航空宇宙事業', 'https://www.khi.co.jp/'),
(9, '株式会社ぐるなび', '愛知県名古屋市中区栄3-18-1 ナディアパーク', 1989, 200000000, 1500, 'レストラン情報サービス', 'https://corporate.gnavi.co.jp/'),
(10, 'トヨタ自動車株式会社', '愛知県豊田市トヨタ町1番地', 1937, 6354000000, 370000, '自動車製造・モビリティサービス', 'https://global.toyota/'),
(11, 'ソフトバンクグループ株式会社', '福岡県福岡市博多区博多駅前2-19-24 大博センタービル', 1981, 2387000000, 240, '投資・テクノロジー事業', 'https://group.softbank/'),
(12, '株式会社麻生', '福岡県飯塚市芳雄町7-18', 1872, 100000000, 2500, '教育・医療・建設事業', 'https://www.aso.ac.jp/'),
(13, '株式会社サイバーエージェント北海道', '北海道札幌市中央区北2条東4丁目1-2 サッポロファクトリー', 2005, 50000000, 200, 'インターネット広告・メディア事業', 'https://www.cyberagent.co.jp/'),
(14, '株式会社ラック', '北海道札幌市白石区本郷通3丁目北1-25', 1986, 100000000, 1800, '情報セキュリティ事業', 'https://www.lac.co.jp/'),
(15, '東北電力株式会社', '宮城県仙台市青葉区本町1-7-1', 1951, 250000000, 12000, '電力・エネルギー事業', 'https://www.tohoku-epco.co.jp/'),
(16, 'TDK株式会社', '宮城県にかほ市平沢字家の上34-1', 1935, 323000000, 107000, '電子部品・材料事業', 'https://www.tdk.com/'),
(17, '株式会社IHI', '埼玉県さいたま市北区日進町2-1917', 1853, 1546000000, 29000, '重工業・プラント事業', 'https://www.ihi.co.jp/'),
(18, '株式会社カプコン', '埼玉県草加市氷川町2102-11', 1979, 332000000, 3000, 'ゲーム・エンターテインメント事業', 'https://www.capcom.co.jp/'),
(19, '千葉銀行', '千葉県千葉市中央区千葉港1-2', 1943, 145000000, 4500, '地方銀行・金融サービス', 'https://www.chibabank.co.jp/'),
(20, 'イオン株式会社', '千葉県美浜区中瀬1-5-1', 1969, 220000000, 57000, '小売・サービス事業', 'https://www.aeon.info/'),
(21, '群馬銀行', '群馬県前橋市元総社町194', 1932, 140000000, 3800, '地方銀行・金融サービス', 'https://www.gunmabank.co.jp/'),
(22, '株式会社SUBARU', '群馬県太田市スバル町1-1', 1953, 1538000000, 16000, '自動車製造事業', 'https://www.subaru.co.jp/'),
(23, '栃木銀行', '栃木県宇都宮市西原町1-5', 1942, 120000000, 1200, '地方銀行・金融サービス', 'https://www.tochigibank.co.jp/'),
(24, 'カルビー株式会社', '栃木県清原工業団地5番地', 1949, 120000000, 4400, '食品製造事業', 'https://www.calbee.co.jp/'),
(25, '山梨中央銀行', '山梨県甲府市丸の内1-20-8', 1941, 115000000, 1900, '地方銀行・金融サービス', 'https://www.yamanashibank.co.jp/'),
(26, 'ファナック株式会社', '山梨県南都留郡忍野村忍草3580', 1972, 691000000, 8500, '産業用ロボット・工作機械事業', 'https://www.fanuc.co.jp/'),
(27, '長野銀行', '長野県松本市渚1-7-52', 1950, 110000000, 1100, '地方銀行・金融サービス', 'https://www.naganobank.co.jp/'),
(28, 'セイコーエプソン株式会社', '長野県諏訪市大和3-3-5', 1942, 532000000, 81000, 'プリンター・電子機器事業', 'https://www.epson.jp/'),
(29, '第四北越銀行', '新潟県新潟市中央区東堀前通7-1071-1', 1873, 180000000, 3500, '地方銀行・金融サービス', 'https://www.dhbk.co.jp/'),
(30, 'NSGグループ', '新潟県新潟市北区東幸町8-8', 1918, 100000000, 28000, 'ガラス・化学製品事業', 'https://www.nsg.com/');

-- --------------------------------------------------------

--
-- テーブルの構造 `CompanyDetails`
--

CREATE TABLE `CompanyDetails` (
  `id` int NOT NULL,
  `company_id` int NOT NULL,
  `description` text NOT NULL,
  `logo` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `photo_2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `photo_3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `CompanyDetails`
--

INSERT INTO `CompanyDetails` (`id`, `company_id`, `description`, `logo`, `photo`, `photo_2`, `photo_3`) VALUES
(1, 1, '株式会社NTTドコモは、5G・6G技術を活用したモバイル通信サービスの革新的リーダーとして、未来のコミュニケーションを創造します。', './images/logo/logo_1.png', './images/company/company-1.jpg', './images/workspace/workspace-1.jpg', './images/officescenes/officescenes-1.jpg'),
(2, 2, '楽天グループ株式会社は、eコマース・フィンテック・モバイル事業を通じて、デジタル社会のエコシステムを構築しています。', './images/logo/logo_2.png', './images/company/company-2.jpg', './images/workspace/workspace-2.jpg', './images/officescenes/officescenes-2.jpg'),
(3, 3, '富士通株式会社は、DX（デジタルトランスフォーメーション）とAI技術で、企業・社会の持続可能な成長を支援します。', './images/logo/logo_3.png', './images/company/company-3.jpg', './images/workspace/workspace-3.jpg', './images/officescenes/officescenes-3.jpg'),
(4, 4, '株式会社DeNAは、ゲーム・ヘルスケア・自動運転技術で、人々の生活を豊かにするサービスを提供しています。', './images/logo/logo_4.png', './images/company/company-4.jpg', './images/workspace/workspace-4.jpg', './images/officescenes/officescenes-4.jpg'),
(5, 5, 'パナソニック株式会社は、IoT・AI技術を活用したスマートライフソリューションで、快適な暮らしを実現します。', './images/logo/logo_5.png', './images/company/company-5.jpg', './images/workspace/workspace-5.jpg', './images/officescenes/officescenes-5.jpg'),
(6, 6, '株式会社コナミホールディングスは、eスポーツ・デジタルエンターテインメント分野で革新的な体験を提供しています。', './images/logo/logo_6.png', './images/company/company-6.jpg', './images/workspace/workspace-6.jpg', './images/officescenes/officescenes-6.jpg'),
(7, 7, '株式会社MonotaROは、AIとビッグデータを活用したB2B eコマースプラットフォームで製造業界をデジタル化しています。', './images/logo/logo_7.png', './images/company/company-7.jpg', './images/workspace/workspace-7.jpg', './images/officescenes/officescenes-7.jpg'),
(8, 8, '川崎重工業株式会社は、航空宇宙・ロボット技術で次世代産業インフラの構築をリードしています。', './images/logo/logo_8.png', './images/company/company-8.jpg', './images/workspace/workspace-8.jpg', './images/officescenes/officescenes-8.jpg'),
(9, 9, '株式会社ぐるなびは、飲食業界のDXを推進し、グルメ情報プラットフォームで食文化の発展に貢献しています。', './images/logo/logo_9.png', './images/company/company-9.jpg', './images/workspace/workspace-9.jpg', './images/officescenes/officescenes-9.jpg'),
(10, 10, 'トヨタ自動車株式会社は、モビリティサービス・自動運転技術で、未来の移動社会を創造しています。', './images/logo/logo_10.png', './images/company/company-10.jpg', './images/workspace/workspace-10.jpg', './images/officescenes/officescenes-10.jpg'),
(11, 11, 'ソフトバンクグループ株式会社は、AI・IoT投資を通じて、テクノロジー企業の成長を支援する世界的投資グループです。', './images/logo/logo_11.png', './images/company/company-11.jpg', './images/workspace/workspace-11.jpg', './images/officescenes/officescenes-11.jpg'),
(12, 12, '株式会社麻生は、IT教育・医療DX・建設テクノロジーで、九州地域の産業発展をデジタル技術で支援しています。', './images/logo/logo_12.png', './images/company/company-12.jpg', './images/workspace/workspace-12.jpg', './images/officescenes/officescenes-12.jpg'),
(13, 13, '株式会社サイバーエージェント北海道は、インターネット広告・AI技術で、北海道のデジタルマーケティングを革新しています。', './images/logo/logo_13.png', './images/company/company-13.jpg', './images/workspace/workspace-13.jpg', './images/officescenes/officescenes-13.jpg'),
(14, 14, '株式会社ラックは、サイバーセキュリティ・情報システム監査で、企業の情報資産を守る専門集団です。', './images/logo/logo_14.png', './images/company/company-14.jpg', './images/workspace/workspace-14.jpg', './images/officescenes/officescenes-14.jpg'),
(15, 15, '東北電力株式会社は、再生可能エネルギー・スマートグリッド技術で、持続可能な電力供給システムを構築しています。', './images/logo/logo_15.png', './images/company/company-15.jpg', './images/workspace/workspace-15.jpg', './images/officescenes/officescenes-15.jpg'),
(16, 16, 'TDK株式会社は、電子部品・磁性技術・バッテリー技術で、IoT・EV社会のインフラを支えています。', './images/logo/logo_16.png', './images/company/company-16.jpg', './images/workspace/workspace-16.jpg', './images/officescenes/officescenes-16.jpg'),
(17, 17, '株式会社IHIは、航空エンジン・宇宙技術・プラントエンジニアリングで、未来の産業基盤を創造しています。', './images/logo/logo_17.png', './images/company/company-17.jpg', './images/workspace/workspace-17.jpg', './images/officescenes/officescenes-17.jpg'),
(18, 18, '株式会社カプコンは、ゲーム開発・eスポーツ・VR/AR技術で、次世代エンターテインメントを創造しています。', './images/logo/logo_18.png', './images/company/company-18.jpg', './images/workspace/workspace-18.jpg', './images/officescenes/officescenes-18.jpg'),
(19, 19, '千葉銀行は、フィンテック・デジタル金融サービスで、地域企業のDX推進を金融面から支援しています。', './images/logo/logo_19.png', './images/company/company-19.jpg', './images/workspace/workspace-19.jpg', './images/officescenes/officescenes-19.jpg'),
(20, 20, 'イオン株式会社は、リテールテック・デジタル決済・オムニチャネル戦略で、小売業界のデジタル革命をリードしています。', './images/logo/logo_20.png', './images/company/company-20.jpg', './images/workspace/workspace-20.jpg', './images/officescenes/officescenes-20.jpg'),
(21, 21, '群馬銀行は、地域密着型フィンテック・中小企業DX支援で、群馬県の産業デジタル化を推進しています。', './images/logo/logo_21.png', './images/company/company-21.jpg', './images/workspace/workspace-21.jpg', './images/officescenes/officescenes-21.jpg'),
(22, 22, '株式会社SUBARUは、自動運転技術・コネクテッドカー・電動化技術で、モビリティの未来を創造しています。', './images/logo/logo_22.png', './images/company/company-22.jpg', './images/workspace/workspace-22.jpg', './images/officescenes/officescenes-22.jpg'),
(23, 23, '栃木銀行は、地域特化型デジタルバンキング・中小企業IT投資支援で、栃木県の経済成長を金融技術で支えています。', './images/logo/logo_23.png', './images/company/company-23.jpg', './images/workspace/workspace-23.jpg', './images/officescenes/officescenes-23.jpg'),
(24, 24, 'カルビー株式会社は、食品テクノロジー・IoT生産システム・AI品質管理で、スナック食品業界をデジタル化しています。', './images/logo/logo_24.png', './images/company/company-24.jpg', './images/workspace/workspace-24.jpg', './images/officescenes/officescenes-24.jpg'),
(25, 25, '山梨中央銀行は、地域企業のIT化支援・デジタル金融サービスで、山梨県の産業競争力向上に貢献しています。', './images/logo/logo_25.png', './images/company/company-25.jpg', './images/workspace/workspace-25.jpg', './images/officescenes/officescenes-25.jpg'),
(26, 26, 'ファナック株式会社は、産業用ロボット・AI・IoT技術で、製造業のスマートファクトリー化をグローバルに推進しています。', './images/logo/logo_26.jpg', './images/company/company-26.jpg', './images/workspace/workspace-26.jpg', './images/officescenes/officescenes-26.jpg'),
(27, 27, '長野銀行は、地域密着型フィンテック・観光業DX支援で、長野県の観光・製造業のデジタル変革を金融面から支援しています。', './images/logo/logo_27.jpg', './images/company/company-27.jpg', './images/workspace/workspace-27.jpg', './images/officescenes/officescenes-27.jpg'),
(28, 28, 'セイコーエプソン株式会社は、プリンター技術・プロジェクター・ウェアラブル機器で、ビジネス・教育分野のデジタル化を支援しています。', './images/logo/logo_28.png', './images/company/company-28.png', './images/workspace/workspace-28.jpg', './images/officescenes/officescenes-28.png'),
(29, 29, '第四北越銀行は、地域経済のデジタル化・中小企業IT投資支援で、新潟県の産業発展を金融技術で推進しています。', './images/logo/logo_29.jpg', './images/company/company-29.jpg', './images/workspace/workspace-29.jpg', './images/officescenes/officescenes-29.jpg'),
(30, 30, 'NSGグループは、自動車用ガラス・建築用ガラス・太陽電池用ガラス技術で、持続可能な社会インフラを支えています。', './images/logo/logo_30.jpg', './images/company/company-30.jpg', './images/workspace/workspace-30.jpg', './images/officescenes/officescenes-30.jpg');

-- --------------------------------------------------------

--
-- テーブルの構造 `Compenstations`
--

CREATE TABLE `Compenstations` (
  `id` int NOT NULL,
  `job_id` int NOT NULL,
  `salary` int NOT NULL,
  `salary_max` int NOT NULL,
  `bonus_info` varchar(255) NOT NULL,
  `transportation` varchar(255) NOT NULL,
  `allowances` text NOT NULL,
  `trial_period` tinyint(1) NOT NULL,
  `trial_period_conditions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `Compenstations`
--

INSERT INTO `Compenstations` (`id`, `job_id`, `salary`, `salary_max`, `bonus_info`, `transportation`, `allowances`, `trial_period`, `trial_period_conditions`) VALUES
(1, 1, 200000, 320000, '年2回（6月・12月、業績連動）', '全額支給', '通信手当、住宅手当、技術手当、5G開発手当', 1, '6ヶ月間、基本給の95％支給'),
(2, 2, 180000, 300000, '年2回（夏季・冬季、業績連動）', '全額支給', 'EC手当、住宅手当、クラウド手当、楽天ポイント付与', 1, '3ヶ月間、基本給の90％支給'),
(3, 3, 230000, 350000, '年2回（業績により変動）', '全額支給', 'システム手当、住宅手当、PJ手当、資格取得支援金', 1, '6ヶ月間、基本給の95％支給'),
(4, 4, 210000, 550000, '年2回（業績連動）', '全額支給', 'ソフト開発手当、住宅手当、AI手当、特許奨励金', 1, '6ヶ月間、基本給の90％支給'),
(5, 5, 220000, 400000, '年2回（6月・12月）', '月額20,000円まで', 'AV技術手当、住宅手当、デジタル手当、製品開発手当', 1, '3ヶ月間、基本給の90％支給'),
(6, 6, 210000, 450000, '年2回（業績により変動）', '全額支給', 'Fintech手当、住宅手当、金融資格手当、暗号技術手当', 1, '6ヶ月間、基本給の95％支給'),
(7, 7, 240000, 500000, '年2回（業績連動）', '全額支給', 'ロボット技術手当、住宅手当、FA手当、特許手当', 1, '6ヶ月間、基本給の90％支給'),
(8, 8, 250000, 600000, '年2回（6月・12月）', '全額支給', '半導体手当、住宅手当、設計手当、博士号手当', 1, '6ヶ月間、基本給の95％支給'),
(9, 9, 230000, 550000, '年2回（業績により変動）', '全額支給', 'アプリ開発手当、住宅手当、モバイル手当、リリース手当', 1, '3ヶ月間、基本給の90％支給'),
(10, 10, 240000, 650000, '年2回（業績連動）', '全額支給', '車載技術手当、住宅手当、組込み手当、AUTOSAR手当', 1, '6ヶ月間、基本給の90％支給'),
(11, 11, 200000, 700000, '年2回（業績により変動）', '全額支給', 'ゲーム開発手当、住宅手当、Unity手当、ヒット作品賞金', 1, '3ヶ月間、基本給の90％支給'),
(12, 12, 150000, 750000, '年2回（6月・12月）', '全額支給', 'LSI設計手当、住宅手当、ASIC手当、論文発表奨励金', 1, '6ヶ月間、基本給の95％支給'),
(13, 13, 230000, 800000, '年2回（業績により変動）', '全額支給', 'インフラ手当、住宅手当、CCNP手当、24時間対応手当', 1, '3ヶ月間、基本給の90％支給'),
(14, 14, 100000, 850000, '年2回（業績連動）', '全額支給', 'クラウド手当、住宅手当、DevOps手当、AWS認定手当', 1, '3ヶ月間、基本給の90％支給'),
(15, 15, 230000, 950000, '年2回（6月・12月）', '月額15,000円まで', 'データ通信手当、住宅手当、セキュリティ手当、資格手当', 1, '3ヶ月間、基本給の90％支給'),
(16, 16, 450000, 1000000, '年2回（業績により変動）', '全額支給', '組込み手当、住宅手当、制御技術手当、RTOS手当', 1, '3ヶ月間、基本給の90％支給'),
(17, 17, 170000, 350000, '年2回（6月・12月）', '全額支給', 'Java手当、住宅手当、Spring手当、DB設計手当', 1, '3ヶ月間、基本給の90％支給'),
(18, 18, 230000, 300000, '年2回（業績により変動）', '全額支給', 'Web開発手当、住宅手当、React手当、フロントエンド手当', 1, '3ヶ月間、基本給の85％支給'),
(19, 19, 160000, 340000, '年2回（業績連動）', '全額支給', '品質管理手当、住宅手当、テスト手当、アジャイル手当', 1, '3ヶ月間、基本給の90％支給'),
(20, 20, 180000, 330000, '年2回（6月・12月）', '全額支給', 'IT基盤手当、住宅手当、Windows手当、VMware手当', 1, '3ヶ月間、基本給の90％支給'),
(21, 21, 200000, 320000, '年2回（業績により変動）', '全額支給', 'セキュリティ手当、住宅手当、暗号化手当、資格手当', 1, '6ヶ月間、基本給の90％支給'),
(22, 22, 190000, 310000, '年2回（業績連動）', '全額支給', '自動車技術手当、住宅手当、EV手当、バッテリー技術手当', 1, '6ヶ月間、基本給の90％支給'),
(23, 23, 170000, 300000, '年2回（6月・12月）', '全額支給', 'テレコム手当、住宅手当、RF技術手当、信号処理手当', 1, '6ヶ月間、基本給の90％支給'),
(24, 24, 230000, 360000, '年2回（業績により変動）', '月額18,000円まで', '電子部品手当、住宅手当、回路設計手当、EMC手当', 1, '3ヶ月間、基本給の90％支給'),
(25, 25, 250000, 310000, '年2回（業績連動）', '全額支給', 'DX推進手当、住宅手当、戦略企画手当、PMP手当', 1, '6ヶ月間、基本給の95％支給'),
(26, 26, 240000, 330000, '年2回（6月・12月）', '全額支給', '光学技術手当、住宅手当、レーザー手当、精密機器手当', 1, '6ヶ月間、基本給の95％支給'),
(27, 27, 210000, 370000, '年2回（業績により変動）', '全額支給', 'ITサービス手当、住宅手当、API設計手当、アーキテクト手当', 1, '3ヶ月間、基本給の90％支給'),
(28, 28, 260000, 380000, '年2回（6月・12月）', '月額15,000円まで', '電子機器手当、住宅手当、IoT手当、センサー技術手当', 1, '3ヶ月間、基本給の90％支給'),
(29, 29, 240000, 390000, '年2回（業績連動）', '全額支給', 'システム分析手当、住宅手当、BA手当、要件定義手当', 1, '6ヶ月間、基本給の90％支給'),
(30, 30, 120000, 400000, '年2回（6月・12月）', '全額支給', '電力技術手当、住宅手当、パワエレ手当、制御理論手当', 1, '6ヶ月間、基本給の90％支給');

-- --------------------------------------------------------

--
-- テーブルの構造 `Conditions`
--

CREATE TABLE `Conditions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `preference` enum('希望する','希望しない') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `Conditions`
--

INSERT INTO `Conditions` (`id`, `user_id`, `category`, `value`, `preference`) VALUES
(1, 1, 'priority', '年収', NULL),
(2, 1, 'company_type', 'ベンチャー企業', NULL),
(3, 1, 'location', '東京都', NULL),
(4, 1, 'job_type', 'フロントエンドエンジニア', NULL),
(5, 1, 'industry', 'IT・通信', NULL),
(6, 1, 'dev_type', 'Webアプリケーション開発', '希望する'),
(7, 1, 'language', 'JavaScript', NULL),
(8, 2, 'priority', 'ワークライフバランス', NULL),
(9, 2, 'company_type', '大手企業', NULL),
(10, 2, 'location', '大阪府', NULL),
(11, 2, 'job_type', 'バックエンドエンジニア', NULL),
(12, 2, 'industry', '製造業', NULL),
(13, 2, 'dev_type', 'モバイルアプリ開発', '希望しない'),
(14, 2, 'language', 'Python', NULL),
(15, 3, 'priority', '勤務地', NULL),
(16, 3, 'company_type', 'スタートアップ', NULL),
(17, 3, 'location', '愛知県', NULL),
(18, 3, 'job_type', 'フルスタックエンジニア', NULL),
(19, 3, 'industry', '金融', NULL),
(20, 3, 'dev_type', '組み込みシステム開発', '希望する'),
(21, 3, 'language', 'C++', NULL),
(22, 4, 'priority', '企業の安定性', NULL),
(23, 4, 'company_type', '中小企業', NULL),
(24, 4, 'location', '福岡県', NULL),
(25, 4, 'job_type', 'データサイエンティスト', NULL),
(26, 4, 'industry', '医療・福祉', NULL),
(27, 4, 'dev_type', 'クラウドネイティブ開発', '希望しない'),
(28, 4, 'language', 'R', NULL),
(29, 5, 'priority', '成長機会', NULL),
(30, 5, 'company_type', '外資系企業', NULL),
(31, 5, 'location', '北海道', NULL),
(32, 5, 'job_type', 'システムエンジニア', NULL),
(33, 5, 'industry', '教育・研究機関', NULL),
(34, 5, 'dev_type', 'AI・機械学習開発', '希望する'),
(35, 5, 'language', 'Java', NULL);

-- --------------------------------------------------------

--
-- テーブルの構造 `Contact`
--

CREATE TABLE `Contact` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `uName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  `select_p` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `Contact`
--

INSERT INTO `Contact` (`id`, `user_id`, `uName`, `email`, `title`, `message`, `time`, `select_p`) VALUES
(1, 1, '山口', '2410041@i-seifu.jp', 'a', 'testtest', '2025-11-12 16:04:05', '料金・プランについてのお問い合わせ');

-- --------------------------------------------------------

--
-- テーブルの構造 `corporations`
--

CREATE TABLE `corporations` (
  `id` int NOT NULL,
  `company_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `representative_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `corporations`
--

INSERT INTO `corporations` (`id`, `company_name`, `representative_name`, `phone_number`, `email`, `password`) VALUES
(1, 'irevo株式会社', '小野', '0624513798', 'irevo@example.com', '$2b$10$6yZq09s1gnNc9nqiJq4pP.CfOHIAD5ZmHzHkDahksKvYmlMRtE9mS'),
(2, '楽天株式会社', '小林', '012046587934', 'rakuten@example.com', '$2b$10$si5XnQry0C21prxufEuVj..RqtC0MLy0f2NTn4.wriTgwl1k0nTSG');

-- --------------------------------------------------------

--
-- テーブルの構造 `C_History`
--

CREATE TABLE `C_History` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `Research_Details` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Timee` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Internship` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `C_History`
--

INSERT INTO `C_History` (`id`, `user_id`, `Research_Details`, `Timee`, `Internship`) VALUES
(1, 1, 'AIと機械学習', NULL, NULL),
(2, 2, 'データサイエンス', NULL, NULL),
(3, 2, 'IoT技術', NULL, NULL),
(4, 3, 'ロボティクス', NULL, NULL),
(5, 4, 'ネットワークセキュリティ', NULL, NULL),
(6, 5, 'ヒューマンコンピュータインタラクション', NULL, NULL),
(7, 5, 'クラウドコンピューティング', NULL, NULL);

-- --------------------------------------------------------

CREATE TABLE desired_conditions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    important_factors VARCHAR(255),
    company_type VARCHAR(255),
    desired_location VARCHAR(255),
    desired_job VARCHAR(255),
    preferred_language VARCHAR(255),
    other VARCHAR(255)
);

--
-- テーブルの構造 `JobConditions`
--

CREATE TABLE `JobConditions` (
  `id` int NOT NULL,
  `job_id` int NOT NULL,
  `work_location` varchar(255) NOT NULL,
  `work_hours` varchar(255) NOT NULL,
  `overtime_info` varchar(255) NOT NULL,
  `holidays` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `JobConditions`
--

INSERT INTO `JobConditions` (`id`, `job_id`, `work_location`, `work_hours`, `overtime_info`, `holidays`) VALUES
(1, 1, '東京都千代田区永田町2-11-1 山王パークタワー', '9:00-18:00', '月平均20時間程度（フレックス制度あり）', '土日祝日、年末年始、夏季休暇'),
(2, 2, '東京都世田谷区玉川1-14-1 楽天クリムゾンハウス', '10:00-19:00（フレックスタイム制）', '月平均15時間程度', '土日祝日、年末年始、夏季休暇'),
(3, 3, '神奈川県川崎市中原区上小田中4-1-1', '9:00-17:45（フレックスタイム制）', '月平均25時間程度', '土日祝日、年末年始、夏季休暇'),
(4, 4, '神奈川県横浜市西区みなとみらい2-3-3 クイーンズタワーB', '9:30-18:30（フレックスタイム制）', '月平均18時間程度', '土日祝日、年末年始、夏季休暇'),
(5, 5, '大阪府門真市大字門真1006番地', '9:00-17:30', '月平均12時間程度', '土日祝日、年末年始、夏季休暇'),
(6, 6, '大阪府大阪市中央区北浜4-5-33 住友ビル', '10:00-19:00（フレックスタイム制）', '月平均22時間程度', '土日祝日、年末年始、夏季休暇'),
(7, 7, '兵庫県尼崎市竹谷町2-183', '9:00-18:00', '月平均10時間程度', '土日祝日、年末年始、夏季休暇'),
(8, 8, '兵庫県神戸市中央区東川崎町1-1-3', '8:30-17:15', '月平均30時間程度', '土日祝日、年末年始、夏季休暇'),
(9, 9, '愛知県名古屋市中区栄3-18-1 ナディアパーク', '9:00-18:00', '月平均15時間程度', '土日祝日、年末年始、夏季休暇'),
(10, 10, '愛知県豊田市トヨタ町1番地', '8:00-16:50', '月平均20時間程度', '土日祝日、年末年始、夏季休暇'),
(11, 11, '福岡県福岡市博多区博多駅前2-19-24 大博センタービル', '9:00-18:00（フレックスタイム制）', '月平均25時間程度', '土日祝日、年末年始、夏季休暇'),
(12, 12, '福岡県飯塚市芳雄町7-18', '9:00-18:00', '月平均12時間程度', '土日祝日、年末年始、夏季休暇'),
(13, 13, '北海道札幌市中央区北2条東4丁目1-2 サッポロファクトリー', '9:00-18:00（フレックスタイム制）', '月平均18時間程度', '土日祝日、年末年始、夏季休暇'),
(14, 14, '北海道札幌市白石区本郷通3丁目北1-25', '9:00-17:30', '月平均15時間程度', '土日祝日、年末年始、夏季休暇'),
(15, 15, '宮城県仙台市青葉区本町1-7-1', '8:30-17:15', '月平均10時間程度', '土日祝日、年末年始、夏季休暇'),
(16, 16, '宮城県にかほ市平沢字家の上34-1', '8:00-16:45', '月平均25時間程度', '土日祝日、年末年始、夏季休暇'),
(17, 17, '埼玉県さいたま市北区日進町2-1917', '8:30-17:15', '月平均30時間程度', '土日祝日、年末年始、夏季休暇'),
(18, 18, '埼玉県草加市氷川町2102-11', '10:00-19:00（フレックスタイム制）', '月平均20時間程度', '土日祝日、年末年始、夏季休暇'),
(19, 19, '千葉県千葉市中央区千葉港1-2', '9:00-17:00', '月平均8時間程度', '土日祝日、年末年始、夏季休暇'),
(20, 20, '千葉県美浜区中瀬1-5-1', '9:00-18:00', '月平均12時間程度', '土日祝日、年末年始、夏季休暇'),
(21, 21, '群馬県前橋市元総社町194', '9:00-17:00', '月平均5時間程度', '土日祝日、年末年始、夏季休暇'),
(22, 22, '群馬県太田市スバル町1-1', '8:00-16:50', '月平均22時間程度', '土日祝日、年末年始、夏季休暇'),
(23, 23, '栃木県宇都宮市西原町1-5', '9:00-17:00', '月平均6時間程度', '土日祝日、年末年始、夏季休暇'),
(24, 24, '栃木県清原工業団地5番地', '8:00-17:00', '月平均15時間程度', '土日祝日、年末年始、夏季休暇'),
(25, 25, '山梨県甲府市丸の内1-20-8', '9:00-17:00', '月平均7時間程度', '土日祝日、年末年始、夏季休暇'),
(26, 26, '山梨県南都留郡忍野村忍草3580', '8:00-16:45', '月平均28時間程度', '土日祝日、年末年始、夏季休暇'),
(27, 27, '長野県松本市渚1-7-52', '9:00-17:00', '月平均8時間程度', '土日祝日、年末年始、夏季休暇'),
(28, 28, '長野県諏訪市大和3-3-5', '8:30-17:15', '月平均18時間程度', '土日祝日、年末年始、夏季休暇'),
(29, 29, '新潟県新潟市中央区東堀前通7-1071-1', '9:00-17:00', '月平均10時間程度', '土日祝日、年末年始、夏季休暇'),
(30, 30, '新潟県新潟市北区東幸町8-8', '8:00-16:45', '月平均20時間程度', '土日祝日、年末年始、夏季休暇');

-- --------------------------------------------------------

--
-- テーブルの構造 `JobPositions`
--

CREATE TABLE `JobPositions` (
  `id` int NOT NULL,
  `company_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `employment_type` varchar(255) NOT NULL,
  `number_of_hires` int DEFAULT NULL,
  `JobDescription` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `JobPositions`
--

INSERT INTO `JobPositions` (`id`, `company_id`, `title`, `employment_type`, `number_of_hires`, `JobDescription`) VALUES
(1, 1, 'モバイルエンジニア', '正社員', 3, '5G通信技術の開発とモバイルアプリケーションの設計を担当します。'),
(2, 2, 'ECサイト運営', '正社員', 2, 'インターネットショッピングサイトの運営と改善を行います。'),
(3, 3, 'システムエンジニア', '正社員', 5, 'ICTソリューションの設計・開発・運用を行います。'),
(4, 4, 'ゲーム開発者', '正社員', 2, 'モバイルゲームの企画・開発・運営を担当します。'),
(5, 5, '電子機器設計者', '正社員', 4, 'エレクトロニクス製品の設計と製造技術の開発を行います。'),
(6, 6, 'ゲームプロデューサー', '正社員', 1, 'ゲーム開発プロジェクトの統括管理を行います。'),
(7, 7, 'ECマーケティング', '正社員', 2, 'Eコマースサイトのマーケティング戦略の立案・実行を担当します。'),
(8, 8, '航空機エンジニア', '正社員', 3, '航空機エンジンの設計・開発・製造を行います。'),
(9, 9, 'WEBサービス企画', '正社員', 2, 'レストラン情報サービスの企画・開発を担当します。'),
(10, 10, '自動車エンジニア', '正社員', 6, '自動車の設計・開発・製造技術の向上を行います。'),
(11, 11, 'AI研究者', '正社員', 2, '人工知能技術の研究開発を行います。'),
(12, 12, '教育コンサルタント', '正社員', 2, '教育事業の企画・運営・コンサルティングを担当します。'),
(13, 13, 'デジタルマーケティング', '正社員', 3, 'インターネット広告の企画・運用・分析を行います。'),
(14, 14, 'サイバーセキュリティ専門家', '正社員', 2, '情報セキュリティの監査・対策・教育を担当します。'),
(15, 15, '電力システムエンジニア', '正社員', 3, '電力システムの設計・運用・保守を行います。'),
(16, 16, '電子部品開発者', '正社員', 4, '電子部品・材料の研究開発を担当します。'),
(17, 17, 'プラントエンジニア', '正社員', 3, '重工業プラントの設計・建設・保守を行います。'),
(18, 18, 'ゲームディレクター', '正社員', 1, 'ゲーム制作の方向性と品質管理を担当します。'),
(19, 19, '銀行員', '正社員', 3, '個人・法人向け金融サービスの提供を行います。'),
(20, 20, '小売店舗運営', '正社員', 4, '小売店舗の運営管理と顧客サービスを担当します。'),
(21, 21, '融資担当', '正社員', 2, '法人・個人向けの融資業務を担当します。'),
(22, 22, '自動車設計エンジニア', '正社員', 5, '自動車の設計・開発・品質管理を行います。'),
(23, 23, '地方銀行営業', '正社員', 2, '地域密着型の金融サービス営業を担当します。'),
(24, 24, '食品開発技術者', '正社員', 2, '食品の商品開発と製造技術の向上を行います。'),
(25, 25, '資産運用アドバイザー', '正社員', 2, '個人・法人向け資産運用の相談・提案を行います。'),
(26, 26, '産業用ロボット開発者', '正社員', 3, '産業用ロボットの設計・開発・製造を担当します。'),
(27, 27, '地域金融コンサルタント', '正社員', 2, '地域企業向け金融コンサルティングを行います。'),
(28, 28, 'プリンター技術者', '正社員', 3, 'プリンター・電子機器の技術開発を担当します。'),
(29, 29, '金融システム開発者', '正社員', 2, '銀行システムの開発・運用・保守を行います。'),
(30, 30, 'ガラス技術者', '正社員', 2, 'ガラス製品の研究開発と製造技術の向上を担当します。');

-- --------------------------------------------------------

--
-- テーブルの構造 `JobRequirements`
--

CREATE TABLE `JobRequirements` (
  `id` int NOT NULL,
  `job_id` int NOT NULL,
  `required_skills` text NOT NULL,
  `preferred_skills` text,
  `education_age_requirements` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- テーブルのデータのダンプ `JobRequirements`
--

INSERT INTO `JobRequirements` (`id`, `job_id`, `required_skills`, `preferred_skills`, `education_age_requirements`) VALUES
(1, 1, '5G・6G技術知識、モバイル通信経験', 'ネットワークスペシャリスト、通信業界経験3年以上', '大学卒業以上（理工系優遇）、25歳〜40歳'),
(2, 2, 'Webサービス開発経験、インターネット技術', 'AWS/GCP認定、Eコマース経験、Ruby/Python', '大学卒業以上、22歳〜35歳'),
(3, 3, 'システム開発経験、プロジェクト管理', 'Java、.NET、PMPまたは基本情報技術者', '大学卒業以上（情報系優遇）、25歳〜45歳'),
(4, 4, 'ソフトウェア開発経験、データベース設計', 'クラウド技術、AI/ML知識、Oracle認定', '大学卒業以上（理工系）、24歳〜40歳'),
(5, 5, 'AV機器技術知識、電子回路設計', '映像・音響技術、デジタル信号処理経験', '高専・大学卒業以上、25歳〜45歳'),
(6, 6, 'Fintech開発経験、金融システム知識', 'ブロックチェーン技術、証券業界経験', '大学卒業以上（理工・経済系）、26歳〜42歳'),
(7, 7, '産業用ロボット技術、制御システム', 'PLC制御、FA技術、機械設計経験', '高専・大学卒業以上（機械・電気系）、25歳〜50歳'),
(8, 8, '半導体設計技術、集積回路設計', 'VLSI設計、HDL言語、半導体プロセス知識', '大学院卒業以上（電子・物理系）、25歳〜45歳'),
(9, 9, 'アプリケーション開発、モバイル技術', 'iOS/Android開発、Swift、Kotlin', '大学・専門学校卒業以上、22歳〜38歳'),
(10, 10, '自動車技術、組込みシステム開発', 'AUTOSAR、車載ネットワーク、C/C++', '大学卒業以上（機械・電気系）、25歳〜45歳'),
(11, 11, 'ゲーム開発経験、リアルタイム処理', 'Unity、Unreal Engine、3Dグラフィックス', '専門学校・大学卒業以上、22歳〜40歳'),
(12, 12, 'LSI設計技術、デジタル回路設計', 'Verilog/VHDL、ASIC設計、論理合成', '大学院卒業以上（電子・情報系）、25歳〜42歳'),
(13, 13, 'ITインフラ構築、ネットワーク技術', 'CCNA/CCNP、Linux、仮想化技術', '大学・専門学校卒業以上、24歳〜40歳'),
(14, 14, 'ソフトウェア開発、デジタル技術', 'クラウド開発、マイクロサービス、DevOps', '大学卒業以上（情報系）、23歳〜38歳'),
(15, 15, 'データ通信技術、ネットワーク構築', 'TCP/IP、ルーティング、セキュリティ', '高専・大学卒業以上、25歳〜45歳'),
(16, 16, '産業機器制御、組込みソフト開発', 'リアルタイムOS、制御理論、C言語', '高専・大学卒業以上（電気・機械系）、24歳〜45歳'),
(17, 17, 'システム開発経験、基盤技術', 'Java、Spring Framework、SQL', '大学卒業以上（情報系）、22歳〜40歳'),
(18, 18, 'Web開発経験、フロントエンド技術', 'JavaScript、React、Vue.js、HTML/CSS', '専門学校・大学卒業以上、22歳〜35歳'),
(19, 19, 'ソフトウェア開発、品質管理', 'テスト自動化、CI/CD、アジャイル開発', '大学卒業以上、24歳〜38歳'),
(20, 20, 'IT基盤構築、システム運用', 'Windows Server、Active Directory、VMware', '大学・専門学校卒業以上、25歳〜42歳'),
(21, 21, 'ネットワーク技術、セキュリティ', 'ファイアウォール、IDS/IPS、暗号化技術', '大学卒業以上（情報系）、25歳〜40歳'),
(22, 22, '自動車技術、電動化システム', 'EV/HV技術、バッテリー管理、モーター制御', '大学卒業以上（機械・電気系）、26歳〜45歳'),
(23, 23, 'テレコム技術、信号処理', 'デジタル変調、RF技術、アンテナ設計', '大学卒業以上（電子・通信系）、25歳〜40歳'),
(24, 24, '電子部品技術、回路設計', 'アナログ回路、電源設計、EMC対策', '高専・大学卒業以上（電子系）、24歳〜45歳'),
(25, 25, 'IT企画・戦略立案、DX推進', 'プロジェクトマネジメント、ビジネス分析', '大学卒業以上（理工・経営系）、28歳〜45歳'),
(26, 26, '光学技術、精密機器設計', 'レーザー技術、光学設計、精密加工', '大学院卒業以上（物理・光学系）、25歳〜45歳'),
(27, 27, 'ITサービス企画、システム設計', 'クラウドアーキテクチャ、API設計', '大学卒業以上（情報系）、26歳〜42歳'),
(28, 28, '電子機器開発、組込みシステム', 'マイコン制御、センサー技術、IoT', '高専・大学卒業以上（電子・情報系）、24歳〜40歳'),
(29, 29, 'IT企画・システム分析', 'ビジネスアナリスト、要件定義、UML', '大学卒業以上（情報・経営系）、26歳〜40歳'),
(30, 30, '電力システム技術、制御技術', 'パワーエレクトロニクス、電力変換、制御理論', '大学卒業以上（電気系）、25歳〜45歳');

-- --------------------------------------------------------

--
-- テーブルの構造 `Memo`
--

CREATE TABLE `Memo` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `Companies_id` int NOT NULL,
  `memo_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_at` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- テーブルの構造 `skill`
--

CREATE TABLE `skill` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `skill_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `skill_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `experience` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `skill`
--

INSERT INTO `skill` (`id`, `user_id`, `skill_type`, `skill_name`, `experience`, `created_at`, `updated_at`) VALUES
(1, 1, 'Framework', 'React', '3 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(2, 1, 'Database', 'MySQL', '2 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(3, 1, 'Cloud', 'AWS', '1 year', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(4, 2, 'Tools', 'Docker', '2 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(5, 2, 'Other', 'Git', '4 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(6, 3, 'Framework', 'Angular', '1 year', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(7, 3, 'Database', 'PostgreSQL', '3 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(8, 4, 'Cloud', 'Azure', '2 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(9, 4, 'Tools', 'Kubernetes', '1 year', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(10, 5, 'Other', 'Linux', '5 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55'),
(11, 5, 'Framework', 'Vue.js', '2 years', '2025-09-24 05:05:55', '2025-09-24 05:05:55');


CREATE TABLE skillPR (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    program VARCHAR(100),
    framework VARCHAR(100),
    database_system VARCHAR(100),
    cloud_platform VARCHAR(100),
    development_tool VARCHAR(100)
);

-- --------------------------------------------------------

--
-- テーブルの構造 `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `u_Fname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_Lname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_kana` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_nick` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Birthday` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_Contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_Address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `u_Password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `u_Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Employment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `User`
--

INSERT INTO `User` (`id`, `u_Fname`, `u_Lname`, `u_kana`, `u_nick`, `Birthday`, `Gender`, `u_Contact`, `u_Address`, `u_Password`, `u_Email`, `Employment`) VALUES
(1, '太郎', '山田', 'ヤマダ タロウ', 'タロウ', '1990-01-01', '1', '090-1234-5678', '東京都渋谷区神南1-23-8', 'a', 'a', '学生'),
(2, '花子', '鈴木', 'スズキ ハナコ', 'ハナコ', '1995-05-05', '2', '080-2345-6789', '大阪府大阪市北区中崎西2-4-12', 'password456', 'hanako@example.com', '在職中'),
(3, '次郎', '高橋', 'タカハシ ジロウ', 'ジロウ', '1988-12-12', '1', '070-3456-7890', '愛知県名古屋市中区錦3-10-5', 'password789', 'jiro@example.com', '学生'),
(4, '紘輝', '小野', 'オノ　ヒロキ', 'burijake', '2005-07-14', '1', '090-8232-2398', '福岡県福岡市博多区博多駅前4-6-2', 'Hiroki7114', '2410019@i-seifu.jp', '在職中'),
(5, '鮎期', '山口', 'ヤマグチ　アユキ', 'ベル', '1985-07-07', '1', '07012341234', '北海道札幌市中央区南一条西7-15-3', '2024ga', '2410041@i-seifu.jp', '学生'),
(6, '眞人', '志田', 'クスリ', 'クスリ', '2010-01-01', '1', '01012341234', NULL, '$2b$10$PZUCbuLpbM/dQ.rZ9o1gruGmM1MzSWUSpLoCl5XShYqSTQUIWH5hK', '2410056@i-seifu.jp', '学生'),
(7, '志田', 'クスリ', 'クスリ・シダ', 'クスリ', '2006-10-27', '1', '01012341234', '奈良県橿原市城殿町344-12', 'lalala65', 'yamaguchia1027@gmail.com', '学生'),
(8, 'a', 'a', 'a', 'a', '1990-01-01', '2', '06-1111-1231', '奈良県高市郡高取町', 'plplpl54', 'gvp.1027.fpd@gmail.com', '離職中');

-- --------------------------------------------------------

--
-- テーブルの構造 `user_chat`
--

CREATE TABLE `user_chat` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `Companies_id` int NOT NULL,
  `message_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- テーブルのデータのダンプ `user_chat`
--

INSERT INTO `user_chat` (`id`, `user_id`, `Companies_id`, `message_text`, `time`) VALUES
(1, 1, 1, 'こんにちは、御社の求人に興味があります。', '2025-10-23 04:57:55'),
(2, 1, 2, '面接の日程を調整したいです。', '2025-10-23 04:59:37'),
(3, 2, 1, 'ポジションについて詳しく教えてください。', '2023-10-03 09:15:00'),
(4, 2, 3, '応募書類を送付しました。ご確認ください。', '2023-10-04 16:45:00'),
(5, 3, 2, '面接のフィードバックをいただけますか？', '2023-10-05 11:20:00'),
(6, 3, 3, '次のステップについて教えてください。', '2023-10-06 13:50:00'),
(7, 4, 1, '御社の企業文化について知りたいです。', '2023-10-07 15:10:00'),
(8, 4, 2, '面接の準備についてアドバイスをお願いします。', '2023-10-08 10:40:00'),
(9, 5, 3, '求人情報の更新を教えてください。', '2023-10-09 12:30:00'),
(10, 5, 1, '面接の日程を再調整したいです。', '2023-10-10 14:00:00'),
(11, 1, 27, '', '2025-11-13 00:48:00'),
(12, 1, 27, 'よろしくお願いします', '2025-11-12 15:48:30'),
(13, 1, 27, 'あ', '2025-11-12 15:49:00'),
(14, 1, 27, 's', '2025-11-13 00:57:48');

-- --------------------------------------------------------

--
-- ビュー用の代替構造 `ViewCompanyTable`
-- (実際のビューを参照するには下にあります)
--
CREATE TABLE `ViewCompanyTable` (
  `id` INT,
  `c_name` VARCHAR(255),
  `location` VARCHAR(255),
  `founded_year` INT,
  `capital` DECIMAL(10,0),
  `employee_count` INT,
  `description` TEXT,
  `homepage_url` VARCHAR(255),
  `company_detail_description` TEXT,
  `logo` VARCHAR(255),
  `photo` VARCHAR(255),
  `job_id` INT,
  `title` VARCHAR(255),
  `employment_type` VARCHAR(255),
  `number_of_hires` INT,
  `JobDescription` TEXT,
  `salary` INT,
  `salary_max` INT,
  `bonus_info` VARCHAR(255),
  `transportation` VARCHAR(255),
  `allowances` TEXT,
  `trial_period` TINYINT(1),
  `trial_period_conditions` TEXT,
  `work_location` VARCHAR(255),
  `work_hours` VARCHAR(255),
  `overtime_info` VARCHAR(255),
  `holidays` VARCHAR(255),
  `required_skills` TEXT,
  `preferred_skills` TEXT,
  `education_age_requirements` TEXT,
  `application_method` TEXT,
  `selection_flow` TEXT,
  `interview_location` TEXT,
  `insurance` VARCHAR(255),
  `benefits_system` TEXT,
  `training` TINYINT(1),
  `training_details` TEXT
);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `ApplicationProcess`
--
ALTER TABLE `ApplicationProcess`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `Benefits`
--
ALTER TABLE `Benefits`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `calendarEvents`
--
ALTER TABLE `calendarEvents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_company_date` (`user_id`,`Companies_id`,`event_date`);

--
-- テーブルのインデックス `chart`
--
ALTER TABLE `chart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `Companies`
--
ALTER TABLE `Companies`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `CompanyDetails`
--
ALTER TABLE `CompanyDetails`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `Compenstations`
--
ALTER TABLE `Compenstations`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `Conditions`
--
ALTER TABLE `Conditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `Contact`
--
ALTER TABLE `Contact`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `corporations`
--
ALTER TABLE `corporations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- テーブルのインデックス `C_History`
--
ALTER TABLE `C_History`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `JobConditions`
--
ALTER TABLE `JobConditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- テーブルのインデックス `JobPositions`
--
ALTER TABLE `JobPositions`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `JobRequirements`
--
ALTER TABLE `JobRequirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- テーブルのインデックス `Memo`
--
ALTER TABLE `Memo`
  ADD PRIMARY KEY (`id`);

--
-- テーブルのインデックス `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `u_Email` (`u_Email`);

--
-- テーブルのインデックス `user_chat`
--
ALTER TABLE `user_chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `Companies_id` (`Companies_id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `ApplicationProcess`
--
ALTER TABLE `ApplicationProcess`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `Benefits`
--
ALTER TABLE `Benefits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `calendarEvents`
--
ALTER TABLE `calendarEvents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- テーブルの AUTO_INCREMENT `chart`
--
ALTER TABLE `chart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- テーブルの AUTO_INCREMENT `Companies`
--
ALTER TABLE `Companies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `CompanyDetails`
--
ALTER TABLE `CompanyDetails`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `Compenstations`
--
ALTER TABLE `Compenstations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `Conditions`
--
ALTER TABLE `Conditions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- テーブルの AUTO_INCREMENT `Contact`
--
ALTER TABLE `Contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- テーブルの AUTO_INCREMENT `corporations`
--
ALTER TABLE `corporations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- テーブルの AUTO_INCREMENT `C_History`
--
ALTER TABLE `C_History`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- テーブルの AUTO_INCREMENT `JobConditions`
--
ALTER TABLE `JobConditions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `JobPositions`
--
ALTER TABLE `JobPositions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `JobRequirements`
--
ALTER TABLE `JobRequirements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- テーブルの AUTO_INCREMENT `Memo`
--
ALTER TABLE `Memo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- テーブルの AUTO_INCREMENT `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- テーブルの AUTO_INCREMENT `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- テーブルの AUTO_INCREMENT `user_chat`
--
ALTER TABLE `user_chat`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

-- --------------------------------------------------------

--
-- ビュー用の構造 `ViewCompanyTable`
--
DROP TABLE IF EXISTS `ViewCompanyTable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `ViewCompanyTable`  AS SELECT `c`.`id` AS `id`, `c`.`c_name` AS `c_name`, `c`.`location` AS `location`, `c`.`founded_year` AS `founded_year`, `c`.`capital` AS `capital`, `c`.`employee_count` AS `employee_count`, `c`.`description` AS `description`, `c`.`homepage_url` AS `homepage_url`, `cd`.`description` AS `company_detail_description`, `cd`.`logo` AS `logo`, `cd`.`photo` AS `photo`, `jp`.`id` AS `job_id`, `jp`.`title` AS `title`, `jp`.`employment_type` AS `employment_type`, `jp`.`number_of_hires` AS `number_of_hires`, `jp`.`JobDescription` AS `JobDescription`, `comp`.`salary` AS `salary`, `comp`.`bonus_info` AS `bonus_info`, `comp`.`transportation` AS `transportation`, `comp`.`allowances` AS `allowances`, `comp`.`trial_period` AS `trial_period`, `comp`.`trial_period_conditions` AS `trial_period_conditions`, `jc`.`work_location` AS `work_location`, `jc`.`work_hours` AS `work_hours`, `jc`.`overtime_info` AS `overtime_info`, `jc`.`holidays` AS `holidays`, `jr`.`required_skills` AS `required_skills`, `jr`.`preferred_skills` AS `preferred_skills`, `jr`.`education_age_requirements` AS `education_age_requirements`, `ap`.`application_method` AS `application_method`, `ap`.`selection_flow` AS `selection_flow`, `ap`.`interview_location` AS `interview_location`, `b`.`insurance` AS `insurance`, `b`.`benefits_system` AS `benefits_system`, `b`.`training` AS `training`, `b`.`training_details` AS `training_details` FROM (((((((`CompanyDetails` `cd` left join `Companies` `c` on((`c`.`id` = `cd`.`company_id`))) left join `JobPositions` `jp` on((`c`.`id` = `jp`.`company_id`))) left join `Compenstations` `comp` on((`jp`.`id` = `comp`.`job_id`))) left join `JobConditions` `jc` on((`jp`.`id` = `jc`.`job_id`))) left join `JobRequirements` `jr` on((`jp`.`id` = `jr`.`job_id`))) left join `ApplicationProcess` `ap` on((`jp`.`id` = `ap`.`job_id`))) left join `Benefits` `b` on((`jp`.`id` = `b`.`job_id`))) ;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `chart`
--
ALTER TABLE `chart`
  ADD CONSTRAINT `chart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE;

--
-- テーブルの制約 `Conditions`
--
ALTER TABLE `Conditions`
  ADD CONSTRAINT `Conditions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE;

--
-- テーブルの制約 `Contact`
--
ALTER TABLE `Contact`
  ADD CONSTRAINT `Contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

--
-- テーブルの制約 `C_History`
--
ALTER TABLE `C_History`
  ADD CONSTRAINT `C_History_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE;

--
-- テーブルの制約 `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE;

--
-- テーブルの制約 `user_chat`
--
ALTER TABLE `user_chat`
  ADD CONSTRAINT `user_chat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_chat_ibfk_2` FOREIGN KEY (`Companies_id`) REFERENCES `Companies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
