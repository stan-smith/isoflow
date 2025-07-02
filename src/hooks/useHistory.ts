import { useCallback } from 'react';
import { useModelStore } from 'src/stores/modelStore';
import { useSceneStore } from 'src/stores/sceneStore';

export const useHistory = () => {
    // Call all hooks unconditionally at the top level with safe fallbacks
    const modelActions = useModelStore((state) => {
        return state?.actions;
    });
    const sceneActions = useSceneStore((state) => {
        return state?.actions;
    });
    const modelCanUndo = useModelStore((state) => {
        return state?.actions?.canUndo?.() ?? false;
    });
    const sceneCanUndo = useSceneStore((state) => {
        return state?.actions?.canUndo?.() ?? false;
    });
    const modelCanRedo = useModelStore((state) => {
        return state?.actions?.canRedo?.() ?? false;
    });
    const sceneCanRedo = useSceneStore((state) => {
        return state?.actions?.canRedo?.() ?? false;
    });

    // Derived values
    const canUndo = modelCanUndo || sceneCanUndo;
    const canRedo = modelCanRedo || sceneCanRedo;

    const undo = useCallback(() => {
        if (!modelActions || !sceneActions) return false;

        let undoPerformed = false;

        // Try to undo model first, then scene
        if (modelActions.canUndo()) {
            undoPerformed = modelActions.undo() || undoPerformed;
        }
        if (sceneActions.canUndo()) {
            undoPerformed = sceneActions.undo() || undoPerformed;
        }

        return undoPerformed;
    }, [modelActions, sceneActions]);

    const redo = useCallback(() => {
        if (!modelActions || !sceneActions) return false;

        let redoPerformed = false;

        // Try to redo model first, then scene
        if (modelActions.canRedo()) {
            redoPerformed = modelActions.redo() || redoPerformed;
        }
        if (sceneActions.canRedo()) {
            redoPerformed = sceneActions.redo() || redoPerformed;
        }

        return redoPerformed;
    }, [modelActions, sceneActions]);

    const saveToHistory = useCallback(() => {
        if (!modelActions || !sceneActions) return;

        modelActions.saveToHistory();
        sceneActions.saveToHistory();
    }, [modelActions, sceneActions]);

    const clearHistory = useCallback(() => {
        if (!modelActions || !sceneActions) return;

        modelActions.clearHistory();
        sceneActions.clearHistory();
    }, [modelActions, sceneActions]);

    return {
        undo,
        redo,
        canUndo,
        canRedo,
        saveToHistory,
        clearHistory
    };
};
