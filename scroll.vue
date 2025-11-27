import { ref, onMounted, onUnmounted } from "vue";

export function useMutationAutoScroll() {
  const containerRef = ref<HTMLElement | null>(null);
  const autoScroll = ref(true);

  let mutationObserver: MutationObserver | null = null;

  const scrollToBottom = () => {
    if (!autoScroll.value || !containerRef.value) return;

    requestAnimationFrame(() => {
      containerRef.value!.scrollTop = containerRef.value!.scrollHeight;
    });
  };

  const handleScroll = () => {
    const el = containerRef.value!;
    autoScroll.value = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
  };

  const observeImages = () => {
    const el = containerRef.value;
    if (!el) return;

    el.querySelectorAll("img").forEach((img) => {
      img.onload = () => scrollToBottom();
    });
  };

  onMounted(() => {
    const el = containerRef.value;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);

    // ⚡ MutationObserver：监听所有 DOM 变化
    mutationObserver = new MutationObserver(() => {
      scrollToBottom(); // DOM 变化后滚一次
      observeImages();  // 图片加载再滚一次
    });

    mutationObserver.observe(el, {
      childList: true,     // 子节点变动
      subtree: true,       // 深度监听
      characterData: true, // 文本变化
    });
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener("scroll", handleScroll);
    mutationObserver?.disconnect();
  });

  return { containerRef };
}
