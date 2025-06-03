import { useCallback } from "react";

const useScrollToTop = () => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return { scrollToTop };
};

export default useScrollToTop;
