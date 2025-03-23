import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateBlock,
  removeBlock,
  moveBlockUp,
  moveBlockDown,
} from "../../store/slices/blocksSlice";
import EditorModal from "../EditorModal/EditorModal";
import styles from "./Block.module.scss";
import EditorTextModal from "../EditorModal/EditorTextModal";
import EditorTestModal from "../EditorModal/EditorTestModal";

const Block = ({ block, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [isTextEditing, setTextIsEditing] = useState(false);
  const [isTestEditing, setTestIsEditing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const dispatch = useDispatch();

  // TODO: Реализовать функцию редактирования блока
  const handleEdit = () => {

    if(block.type === 'title') {
      setIsEditing(true);
    } else if(block.type === 'text') {
      setTextIsEditing(true);
    } else if(block.type === 'test') {
      setTestIsEditing(true);
    }    
  };

  const ref = useRef(null)


  // TODO: Реализовать функцию сохранения изменений блока
  const handleSave = (newData) => {};

  // TODO: Реализовать функцию удаления блока
  const handleDelete = (id) => {
    dispatch(removeBlock(id))
  };

  // TODO: Реализовать функцию перемещения блока вверх
  const handleMoveUp = () => {};

  // TODO: Реализовать функцию перемещения блока вниз
  const handleMoveDown = () => {};

  // TODO: Реализовать функцию обработки изменения ответа
  const handleAnswerChange = (index, checked) => {
    if(isMultipleChoice) {
      if(checked) {
        setSelectedAnswers([...selectedAnswers, index])
      } else {
        setSelectedAnswers(p => p.filter(item => item !== index))
      }
    } else {
      setSelectedAnswers(prevArr => {
        return prevArr.find(item => item === index) ? prevArr : [index]
      })
    }   
  }

  // TODO: Реализовать функцию проверки ответа
  const handleCheckAnswer = () => {
    if(block.type === 'test'){
      setShowAnswer(true)
    }
  }

  // TODO: Реализовать определение типа теста (множественный выбор)
  const isMultipleChoice = useMemo(()=> {
    let howManyCorrect = 0
    if(block.type === 'test'){
      howManyCorrect = block.content.options.reduce((acc, item ) => {
          if(item.isCorrect) acc++
        return acc
      }, 0)
    }
    
    return howManyCorrect > 1

  }, [block])

  // TODO: Реализовать проверку правильности ответа
  const isAnswerCorrect = (index) => {
    
    if(selectedAnswers.length === 0 || !showAnswer) return 
    if(isMultipleChoice){
      return true
    } else {
      if(selectedAnswers.includes(index) && block.content.options[index].isCorrect) {
        // setText('Truehj')
        return true
      }
      // const isCorrectIndex = block.content.options.findIndex(op => op.isCorrect===true)
      // if(block.content.options[isCorrectIndex].isCorrect) {
      //   return true
      // }
      return false
    }
  }
  // TODO: Реализовать проверку неправильности ответа
  const isAnswerIncorrect = (index) => {
    if(selectedAnswers.length === 0 || !showAnswer) return
    if(isMultipleChoice){

    } else {
      if(selectedAnswers.includes(index) && !block.content.options[index].isCorrect) {
        // setText('Ffgalsy')
        return true
      }
      return false
    }
  }


  const renderContent = () => {
    switch (block.type) {
      case "title":
        return (
          <div 
            className={styles.titleBlock}
          >
            <h2>{block.content.title}</h2>
            <img src={block.content.image} alt={block.content.title} />
          </div>
        );
      case "text":
        return (
          <div 
            className={styles.textBlock}
          >
            <p>{block.content.text}</p>
          </div>
        );
      case "test":
        return (
          <div ref={ref.current}
            className={styles.testBlock} 
          >
            <h3>{block.content.question}</h3>
            <div className={styles.options}>
              {block.content.options.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${
                    isAnswerCorrect(index) ? styles.correct : ""
                  } ${isAnswerIncorrect(index) ? styles.incorrect : ""}`}
                >
                  <label>
                    <input
                      type={isMultipleChoice ? "checkbox" : "radio"}
                      name={`test-${block.id}`}
                      checked={selectedAnswers.includes(index)}
                      onChange={(e) => {
                        handleAnswerChange(index, e.target.checked)
                        }
                      }
                      disabled={showAnswer}
                    />
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
            {!showAnswer && selectedAnswers.length > 0 && (
              <button
                onClick={handleCheckAnswer}
                className={styles.checkButton}
              >
                Проверить
              </button>
            )}
            {showAnswer && (
              <div className={styles.result}>
                {block.content.options[selectedAnswers[0]].isCorrect  ? 'Pravilno' : 'Net'}
                {/* TODO: Реализовать отображение результата */}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.block}>
      <div className={styles.controls}>
        <button className={styles.editButton} onClick={handleEdit}>
          ✎
        </button>
        <button className={styles.deleteButton} onClick={() => handleDelete(block.id)}>
          ✕
        </button>
        {!isFirst && (
          <button className={styles.moveButton} onClick={handleMoveUp}>
            ↑
          </button>
        )}
        {!isLast && (
          <button className={styles.moveButton} onClick={handleMoveDown}>
            ↓
          </button>
        )}
      </div>
      {renderContent()}
      <EditorModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        block={block}
        onSave={handleSave}
      />
      <EditorTextModal
        isOpen={isTextEditing}
        onClose={() => setTextIsEditing(false)}
        block={block}
        onSave={handleSave}
      />
      <EditorTestModal
        isOpen={isTestEditing}
        onClose={() => setTestIsEditing(false)}
        block={block}
        onSave={handleSave}
      />
    </div>
  );
};

export default Block;
