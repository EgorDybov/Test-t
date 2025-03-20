import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./EditorModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateBlock } from "../../store/slices/blocksSlice";

const EditorTextModal = ({ isOpen, onClose, block, onSave }) => {
  const [formData, setFormData] = useState(block.content);
  const dispatch = useDispatch()

const store = useSelector(store => store.blocks)
console.log('store', store);


  useEffect(() => {
    setFormData(block.content);
  }, [block]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBlock({formData, block}))
    onClose()
   
    
    // Реализуйте логику сохранения
  };

  if (!isOpen) return null;

  // Пример реализации модального окна для заголовка
  // TODO: Реализовать модальные окна для других типов блоков
  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <h2>Редактировать текст</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Текст:</label>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
            />
          </div>
          <div className={styles.buttons}>
            <button type="submit" className={styles.saveButton}>
              Сохранить
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditorTextModal;
