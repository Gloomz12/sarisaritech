export const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-PH",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString(
    "en-PH",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};