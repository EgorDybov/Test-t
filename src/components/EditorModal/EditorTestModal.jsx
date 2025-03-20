import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./EditorModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateBlock } from "../../store/slices/blocksSlice";

const EditorTestModal = ({ isOpen, onClose, block, onSave }) => {
  const [formData, setFormData] = useState(block.content);
  const [options, setOptions] = useState([1, 2, 3]);
  const dispatch = useDispatch()

  console.log('block content', block.content);
  

  useEffect(() => {
    setFormData(block.content);
  }, [block]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBlock({formData, block}))
    onClose()
    console.log('test modal', formData);
    
    // Реализуйте логику сохранения
  };

  const addOption = (e) => {
    e.preventDefault()
    setOptions([...options, options.length+1])
  }

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
        <h2>Редактировать тест</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Вопрос:</label>
            <input
              type="text"
              placeholder="Новый вопрос"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label>Варианты ответов:</label>
           <div>
            {
                formData.options.map(option => {
                    return <div className={styles.optionGroup} key={option.key}>
                        <input
                            dataTemp={option.key}
                            type="text"
                            placeholder="Вариант"
                            value={option.text}
                            onChange={(e) => {
                                const val = e.target.value
                                const keyValue =  e.target.getAttribute('datatemp')
                                const options = formData.options.map(option => {
                                    if(option.key === keyValue){
                                      return {
                                        ...option,
                                        text: val
                                      }
                                    }
                                    return option
                                })
                                setFormData({ ...formData, options })
                             }
                            }
                        />
                        <input 
                            type="checkbox" 
                            checked={option.isCorrect}
                            onChange={(e) =>
                                setFormData({ ...formData, options: [] })
                            }
                         />
                        <span>Правильный ответ</span>
                        <button className={styles.removeButton}>Удалить</button>
                    </div>
                })
            }
           </div>
          </div>
          <div><button onClick={addOption} className={styles.addButton}>Добавить вариант</button></div>
          
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

export default EditorTestModal;
