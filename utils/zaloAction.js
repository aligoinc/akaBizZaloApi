export const getUidFromAvatarLink = (avatarLink) => {
    try {
      if (!avatarLink?.trim()) return "";
  
      const lastSlashIndex = avatarLink.lastIndexOf("/");
      const lastDotIndex = avatarLink.lastIndexOf(".");
      if (
        lastSlashIndex === -1 ||
        lastDotIndex === -1 ||
        lastDotIndex <= lastSlashIndex
      )
        return "";
  
      return avatarLink.substring(lastSlashIndex + 1, lastDotIndex);
    } catch (error) {
      console.log(error);
      return "";
    }
};
  
  