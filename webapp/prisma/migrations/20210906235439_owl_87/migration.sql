-- RenameIndex
ALTER INDEX "Channel.name_unique" RENAME TO "Channel_name_key";

-- RenameIndex
ALTER INDEX "UserAccount.username_unique" RENAME TO "UserAccount_username_key";

-- RenameIndex
ALTER INDEX "UserEmail.original_unique" RENAME TO "UserEmail_original_key";

-- RenameIndex
ALTER INDEX "UserOpenIdToken.sub_unique" RENAME TO "UserOpenIdToken_sub_key";
