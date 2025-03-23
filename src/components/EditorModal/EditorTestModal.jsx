import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import styles from "./EditorModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateBlock } from "../../store/slices/blocksSlice";
import { uniqueId } from "lodash";

const EditorTestModal = ({ isOpen, onClose, block, onSave }) => {
  const [formData, setFormData] = useState(block.content);
  const [isUpdated, setIsUpdated] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    setFormData(block.content);
  }, [block]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBlock({formData, block}))
    onClose()
  
  };

  const disabledOption = useMemo(() => formData.options?.length <= 2, [formData])
  console.log(formData);
  

  const disabledSave = useMemo(() => {
    
    return (isUpdated && !formData.options?.every(option => !option.isCorrect)) 
      || formData.options?.every(option => !option.isCorrect 
      || !formData.options?.every(option => option.text.trim()) || formData.question.trim() === '')
  }, [isUpdated, formData])


  const addOption = (e) => {
    e.preventDefault();

    const op =  {
      text: 'New option',
      key: uniqueId('__option__'),
      isCorrect: false,
      color: 'red'
    }
    
    setFormData((prev) => {
      return ({
        ...prev,
        options: [...formData.options, op]
      })
    } )

    setIsUpdated(false)
    
  }

  const removeOption = (key) => {
      const updateFormData = {...formData, options: formData.options.filter(option => option.key !== key)}
      setFormData(updateFormData)
      setIsUpdated(false)
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
              onChange={(e) => {
                setFormData({ ...formData, question: e.target.value })
                setIsUpdated(false)
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Варианты ответов:</label>
            <div>
            {
                formData.options.map(option => {
                    return <div className={styles.optionGroup} key={option.key}>
                        <input
                            dataoptiontext={option.key}
                            type="text"
                            placeholder="Вариант"
                            value={option.text}
                            onChange={(e) => {
                              e.preventDefault()
                                const val = e.target.value
                                const keyValue =  e.target.getAttribute('dataoptiontext')
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
                                setIsUpdated(false)
                             }
                             
                            }
                        />
                        <input 
                            type="checkbox" 
                            checked={option.isCorrect}
                            dataoptioncheckbox={option.key}
                            onChange={(e) => {
                                
                              const keyValue = e.target.getAttribute('dataoptioncheckbox')
                              const options = formData.options.map(option => {
                                if(option.key === keyValue){
                                  return {
                                    ...option,
                                    isCorrect: !option.isCorrect,
                                  }
                                }
                                return option
                                })
                                setFormData({ ...formData, options })
                                setIsUpdated(false)
                            }}
                         />
                        <span>Правильный ответ</span>
                        <button
                         disabled={disabledOption}
                         className={styles.removeButton} 
                         onClick={(event) => {event.preventDefault(); removeOption(option.key)}}  
                         >
                          Удалить
                          </button>
                    </div>

                })
            }
            
           </div>
          </div>
          <div><button onClick={addOption} className={styles.addButton}>Добавить вариант</button></div>
          
          <div className={styles.buttons}>
            <button type="submit" className={styles.saveButton} disabled={disabledSave}>
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
