-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : mysql-db:3306
-- Généré le : mer. 06 mai 2026 à 19:59
-- Version du serveur : 8.0.46
-- Version de PHP : 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cinema_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

CREATE TABLE `movie` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `durationInMinutes` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `movie`
--

INSERT INTO `movie` (`id`, `title`, `description`, `durationInMinutes`, `createdAt`, `updatedAt`) VALUES
(1, 'Les Échos du lac gelé', 'Dans un village isolé, une archiviste découvre que les bruits sous la glace reprennent les derniers mots des disparus.', 118, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(2, 'Minuit au bureau des ombres', 'Une stagiaire est embauchée dans une administration qui ne traite que les regrets non déclarés.', 104, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(3, 'La Cartographie des rêves perdus', 'Deux jumeaux naviguent dans une ville où les rues changent selon les souvenirs collectifs.', 132, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(4, 'Protocole Cerise', 'Une IA de tri postal développe une obsession pour une lettre jamais livrée.', 96, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(5, 'Saison des fenêtres ouvertes', 'Portrait d’un quartier où chaque balcon diffuse une radio différente le même soir d’été.', 91, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(6, 'Le Musée des fuseaux', 'Conservatrice d’un musée sans œuvres, elle catalogue les angles morts des visiteurs.', 112, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(7, 'Train 7h14, voie inexistante', 'Un contrôleur suit un train fantôme qui apparaît uniquement lors des grèves.', 124, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(8, 'Bleu horizon industriel', 'Documentaire fiction sur une usine qui fabrique uniquement des échantillons de couleur.', 78, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(9, 'La Société des cartes postales brûlées', 'Mystère autour d’un club qui détruit les souvenirs trop parfaits.', 109, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000'),
(10, 'Orbite domestique', 'Famille confinée dans une station spatiale devenue location Airbnb.', 101, '2026-05-05 22:45:21.000000', '2026-05-05 22:45:21.000000');

-- --------------------------------------------------------

--
-- Structure de la table `room`
--

CREATE TABLE `room` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `images` json NOT NULL,
  `type` varchar(100) NOT NULL,
  `capacity` int NOT NULL,
  `isAccessible` tinyint NOT NULL DEFAULT '0',
  `isMaintenance` tinyint NOT NULL DEFAULT '0',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `room`
--

INSERT INTO `room` (`id`, `name`, `description`, `images`, `type`, `capacity`, `isAccessible`, `isMaintenance`, `createdAt`, `updatedAt`) VALUES
(1, 'Salle Aurore', 'Son immersif, rangées inclinées.', '[]', 'standard', 120, 1, 0, '2026-05-05 22:45:45.000000', '2026-05-05 22:45:45.000000'),
(2, 'Salle Nebula', 'Grand écran, projection laser.', '[\"https://example.com/salles/nebula.jpg\"]', 'premium', 85, 1, 0, '2026-05-05 22:45:45.000000', '2026-05-05 22:45:45.000000'),
(3, 'Studio 4', 'Petite salle dédiée aux avant-premières.', '[]', 'compact', 42, 0, 0, '2026-05-05 22:45:45.000000', '2026-05-05 22:45:45.000000'),
(4, 'Salle Polaris', 'Configuration classique, sono Dolby.', '[]', 'standard', 96, 1, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(5, 'Atlas Premium', 'Fauteuils larges, espace jambes accru.', '[\"https://example.com/salles/atlas.jpg\"]', 'premium', 72, 1, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(6, 'Cabine 12', 'Micro-salle pour avant-premières presse.', '[]', 'compact', 28, 0, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(7, 'Grand Canal', 'Très grande capacité, projection 4K.', '[]', 'imax-lite', 280, 1, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(8, 'Salle Pastel', 'Décoration art déco, audio réduit pour séances enfants.', '[]', 'famille', 88, 1, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(9, 'Observatoire', 'Dernière rangée surélevée, vue dégagée.', '[]', 'standard', 110, 1, 0, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000'),
(10, 'Atelier Nord', 'En travaux ponctuels — réservée tests technique.', '[]', 'technique', 40, 0, 1, '2026-05-05 22:48:30.000000', '2026-05-05 22:48:30.000000');

-- --------------------------------------------------------

--
-- Structure de la table `screening`
--

CREATE TABLE `screening` (
  `id` int NOT NULL,
  `startAt` datetime NOT NULL,
  `endAt` datetime NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `roomId` int DEFAULT NULL,
  `movieId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `screening`
--

INSERT INTO `screening` (`id`, `startAt`, `endAt`, `createdAt`, `updatedAt`, `roomId`, `movieId`) VALUES
(1, '2026-05-15 14:00:00', '2026-05-15 16:15:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 1, 1),
(2, '2026-05-15 14:00:00', '2026-05-15 16:30:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 2, 2),
(3, '2026-05-15 14:00:00', '2026-05-15 15:45:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 3, 3),
(4, '2026-05-15 17:00:00', '2026-05-15 19:10:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 4, 4),
(5, '2026-05-15 17:00:00', '2026-05-15 18:35:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 5, 5),
(6, '2026-05-15 17:00:00', '2026-05-15 19:00:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 6, 6),
(7, '2026-05-15 20:30:00', '2026-05-15 22:40:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 7, 7),
(8, '2026-05-15 20:30:00', '2026-05-15 22:45:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 8, 8),
(9, '2026-05-15 20:30:00', '2026-05-15 21:55:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 9, 9),
(10, '2026-05-15 22:00:00', '2026-05-15 23:05:00', '2026-05-05 22:49:45.000000', '2026-05-05 22:49:45.000000', 10, 10);

-- --------------------------------------------------------

--
-- Structure de la table `ticket`
--

CREATE TABLE `ticket` (
  `id` int NOT NULL,
  `kind` varchar(20) NOT NULL,
  `remainingCredits` int NOT NULL,
  `pricePaid` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  `screeningId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `ticket`
--

INSERT INTO `ticket` (`id`, `kind`, `remainingCredits`, `pricePaid`, `createdAt`, `userId`, `screeningId`) VALUES
(1, 'SIMPLE', 1, 10.00, '2026-05-06 09:26:28.215746', 1, 3),
(2, 'SIMPLE', 1, 10.00, '2026-05-06 09:26:52.789354', 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ticket_usage`
--

CREATE TABLE `ticket_usage` (
  `id` int NOT NULL,
  `usedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ticketId` int DEFAULT NULL,
  `screeningId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `token`
--

CREATE TABLE `token` (
  `id` int NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL,
  `token` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'CLIENT',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `balance`) VALUES
(1, 'test@test.com', '$2b$10$X6Zuc0/Vu1bdRO9L9q.PEODPcfSGMM01nptXGpZiw9.8XcVvFNUYm', 'CLIENT', '2026-05-05 22:26:28.465748', '2026-05-06 09:26:52.000000', 0.00),
(2, 'hi@hi.com', '$2b$10$68wc./gx/VrrbsF7Nk/zmunBxrVd3atwQd1.YMZzmA97VFbHSeIla', 'ADMIN', '2026-05-06 09:31:43.803427', '2026-05-06 09:32:19.186569', 20.00);

-- --------------------------------------------------------

--
-- Structure de la table `wallet_transaction`
--

CREATE TABLE `wallet_transaction` (
  `id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `type` varchar(20) NOT NULL,
  `balanceAfter` decimal(10,2) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `wallet_transaction`
--

INSERT INTO `wallet_transaction` (`id`, `amount`, `type`, `balanceAfter`, `createdAt`, `userId`) VALUES
(1, 20.00, 'DEPOSIT', 20.00, '2026-05-05 22:27:53.686970', 1),
(2, 20.00, 'WITHDRAW', 0.00, '2026-05-05 22:27:56.959957', 1),
(3, 20.00, 'DEPOSIT', 20.00, '2026-05-06 09:24:59.542932', 1),
(4, 10.00, 'WITHDRAW', 10.00, '2026-05-06 09:26:28.200893', 1),
(5, 10.00, 'WITHDRAW', 0.00, '2026-05-06 09:26:52.777134', 1),
(6, 20.00, 'DEPOSIT', 20.00, '2026-05-06 09:32:03.132623', 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_a81090ad0ceb645f30f9399c34` (`title`);

--
-- Index pour la table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_535c742a3606d2e3122f441b26` (`name`);

--
-- Index pour la table `screening`
--
ALTER TABLE `screening`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5e1b4993908da2f77939337c42b` (`roomId`),
  ADD KEY `FK_a84042bef1152d9dbdb1446c811` (`movieId`);

--
-- Index pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_0e01a7c92f008418bad6bad5919` (`userId`),
  ADD KEY `FK_616b80c504c19861ee9c56de34c` (`screeningId`);

--
-- Index pour la table `ticket_usage`
--
ALTER TABLE `ticket_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8d3b254da780d065a31bddeae2f` (`ticketId`),
  ADD KEY `FK_54b9e455d977c933c2c74f7a914` (`screeningId`);

--
-- Index pour la table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_d9959ee7e17e2293893444ea37` (`token`),
  ADD KEY `FK_94f168faad896c0786646fa3d4a` (`userId`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9071d3c9266c4521bdafe29307a` (`userId`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `room`
--
ALTER TABLE `room`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `screening`
--
ALTER TABLE `screening`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `ticket_usage`
--
ALTER TABLE `ticket_usage`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `token`
--
ALTER TABLE `token`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `screening`
--
ALTER TABLE `screening`
  ADD CONSTRAINT `FK_5e1b4993908da2f77939337c42b` FOREIGN KEY (`roomId`) REFERENCES `room` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_a84042bef1152d9dbdb1446c811` FOREIGN KEY (`movieId`) REFERENCES `movie` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_0e01a7c92f008418bad6bad5919` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_616b80c504c19861ee9c56de34c` FOREIGN KEY (`screeningId`) REFERENCES `screening` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ticket_usage`
--
ALTER TABLE `ticket_usage`
  ADD CONSTRAINT `FK_54b9e455d977c933c2c74f7a914` FOREIGN KEY (`screeningId`) REFERENCES `screening` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_8d3b254da780d065a31bddeae2f` FOREIGN KEY (`ticketId`) REFERENCES `ticket` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_94f168faad896c0786646fa3d4a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `wallet_transaction`
--
ALTER TABLE `wallet_transaction`
  ADD CONSTRAINT `FK_9071d3c9266c4521bdafe29307a` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
