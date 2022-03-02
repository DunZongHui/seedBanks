import store from "@/store/index";

export function showButton(val) {
  const re = store.getters.buttons.indexOf(val) !== -1;
  return re;
}
