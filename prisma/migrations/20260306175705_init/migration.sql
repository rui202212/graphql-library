-- CreateTable
CREATE TABLE `Rang` (
    `rangId` VARCHAR(191) NOT NULL,
    `rang` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`rangId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Author` (
    `authorId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NULL,
    `birthDate` VARCHAR(191) NULL,
    `deathDate` VARCHAR(191) NULL,

    PRIMARY KEY (`authorId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edition` (
    `editionId` VARCHAR(191) NOT NULL,
    `editionName` VARCHAR(191) NOT NULL,
    `createDate` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`editionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `genreId` VARCHAR(191) NOT NULL,
    `genre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `typeId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`typeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `bookId` VARCHAR(191) NOT NULL,
    `isbn` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `publishDate` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `editionId` VARCHAR(191) NOT NULL,
    `genreId` VARCHAR(191) NOT NULL,
    `typeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Book_isbn_key`(`isbn`),
    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Library` (
    `libraryId` VARCHAR(191) NOT NULL,
    `libraryName` VARCHAR(191) NOT NULL,
    `createDate` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `nature` VARCHAR(191) NOT NULL,
    `endDate` VARCHAR(191) NULL,

    PRIMARY KEY (`libraryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Copy` (
    `copyId` VARCHAR(191) NOT NULL,
    `acquisitionDate` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `libraryId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`copyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `memberId` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `libraryId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Member_email_key`(`email`),
    PRIMARY KEY (`memberId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `passWord` VARCHAR(191) NOT NULL,
    `rangId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `loanId` VARCHAR(191) NOT NULL,
    `loanDate` VARCHAR(191) NOT NULL,
    `dueDate` VARCHAR(191) NOT NULL,
    `returnDate` VARCHAR(191) NULL,
    `copyId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`loanId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Author`(`authorId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_editionId_fkey` FOREIGN KEY (`editionId`) REFERENCES `Edition`(`editionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`genreId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`typeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Copy` ADD CONSTRAINT `Copy_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Copy` ADD CONSTRAINT `Copy_libraryId_fkey` FOREIGN KEY (`libraryId`) REFERENCES `Library`(`libraryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_libraryId_fkey` FOREIGN KEY (`libraryId`) REFERENCES `Library`(`libraryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rangId_fkey` FOREIGN KEY (`rangId`) REFERENCES `Rang`(`rangId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_copyId_fkey` FOREIGN KEY (`copyId`) REFERENCES `Copy`(`copyId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`memberId`) ON DELETE RESTRICT ON UPDATE CASCADE;
