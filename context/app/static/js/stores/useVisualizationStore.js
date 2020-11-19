import create from 'zustand';

const useVisualizationStore = create((set) => ({
  vizIsFullscreen: false,
  vizEscSnackbarIsOpen: false,
  setVizEscSnackbarIsOpen: (val) => set({ vizEscSnackbarIsOpen: val }),
  expandViz: () => {
    set({ vizIsFullscreen: true, vizEscSnackbarIsOpen: true });
    document.onkeydown = function preventDefault(evt) {
      if (evt.keyCode === 27) evt.preventDefault();
    };
  },
  collapseViz: () => {
    set({ vizIsFullscreen: false, vizEscSnackbarIsOpen: false });
    document.onkeydown = null;
  },
  vizTheme: 'light',
  setVizTheme: (theme) => {
    if (!['dark', 'light'].includes(theme)) {
      return;
    }
    set({ vizTheme: theme });
  },
  vitessceConfig: {},
  setVitessceConfig: (val) => set({ vitessceConfig: val }),
  onCopyUrlMessage: '',
  setOnCopyUrlMessage: (val) => set({ onCopyUrlMessage: val }),
  onCopyUrlMessageSnackbarOpen: false,
  setOnCopyUrlMessageSnackbarOpen: (val) => set({ onCopyUrlMessageSnackbarOpen: val }),
}));

export default useVisualizationStore;
