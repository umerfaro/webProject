import { useState } from "react";
import { questionsData } from "../Helppage/questionData";
// Import questions data

const HelpAndSupport = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [expandedQuestion, setExpandedQuestion] = useState(null); // Track expanded main question
  const [expandedSubQuestion, setExpandedSubQuestion] = useState(null); // Track expanded sub-question

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
    setExpandedSubQuestion(null); // Reset sub-question when toggling a main question
  };

  const toggleSubQuestion = (subIndex) => {
    setExpandedSubQuestion(expandedSubQuestion === subIndex ? null : subIndex);
  };

  // Filtered questions based on search term
  const filteredQuestions = questionsData.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm) ||
      q.subQuestions.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchTerm) ||
          sub.answer.toLowerCase().includes(searchTerm)
      )
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-8">
        Customer Help & Support
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search questions or answers..."
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => (
            <div key={index} className="border-b pb-4">
              {/* Main Question */}
              <button
                className="w-full text-left text-lg font-semibold text-pink-500 hover:underline flex justify-between items-center"
                onClick={() => toggleQuestion(index)}
              >
                {q.question}
                <span className="text-gray-400">
                  {expandedQuestion === index ? "-" : "+"}
                </span>
              </button>

              {/* Sub-Questions */}
              {expandedQuestion === index && (
                <ul className="mt-4 ml-4 space-y-4">
                  {q.subQuestions.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <button
                        className="text-gray-800 font-medium hover:underline flex justify-between items-center w-full"
                        onClick={() => toggleSubQuestion(subIndex)}
                      >
                        {sub.title}
                        <span className="text-gray-400">
                          {expandedSubQuestion === subIndex ? "-" : "+"}
                        </span>
                      </button>

                      {/* Answer */}
                      {expandedSubQuestion === subIndex && (
                        <p className="mt-2 text-gray-600">{sub.answer}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No questions found.</p>
        )}
      </div>
    </div>
  );
};

export default HelpAndSupport;
