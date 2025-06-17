import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addQuiz, updateQuiz } from '../store/slices/quizSlice';
import { quizAPI } from '../services/apiService';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

interface QuizFormData {
  title: string;
  description: string;
  questions: Question[];
}

export default function QuizEditor({ existingQuiz = null }: { existingQuiz?: any }) {
  const [formData, setFormData] = useState<QuizFormData>({
    title: existingQuiz?.title || '',
    description: existingQuiz?.description || '',
    questions: existingQuiz?.questions || [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        timeLimit: 20,
        points: 1000,
      },
    ],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === optionIndex ? value : opt)),
            }
          : q
      ),
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          timeLimit: 20,
          points: 1000,
        },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (existingQuiz) {
        const updatedQuiz = await quizAPI.updateQuiz(existingQuiz.id, formData);
        dispatch(updateQuiz(updatedQuiz));
      } else {
        const newQuiz = await quizAPI.createQuiz(formData);
        dispatch(addQuiz(newQuiz));
      }
      navigate('/my-quizzes');
    } catch (error) {
      console.error('Failed to save quiz:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {existingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Quiz Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleBasicInfoChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleBasicInfoChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Question {questionIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Question Text
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(questionIndex, 'question', e.target.value)
                    }
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex}>
                      <label className="block text-sm font-medium text-gray-700">
                        Option {optionIndex + 1}
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600">(Correct)</span>
                        )}
                      </label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(questionIndex, optionIndex, e.target.value)
                          }
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)
                          }
                          className={`ml-2 px-3 py-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time Limit (seconds)
                    </label>
                    <input
                      type="number"
                      value={question.timeLimit}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          'timeLimit',
                          parseInt(e.target.value)
                        )
                      }
                      min="5"
                      max="60"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Points
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          'points',
                          parseInt(e.target.value)
                        )
                      }
                      min="100"
                      max="2000"
                      step="100"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200"
          >
            Add Question
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/my-quizzes')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            {existingQuiz ? 'Save Changes' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
} 