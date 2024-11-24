import React, { useState, useEffect } from "react";
import "./PasswordPage.css";
import CompletedPage from "./CompletedPage";

// Define password rules
const rules = [
  { id: 1, description: "Your password must be at least 5 characters", validate: (pwd) => pwd.length >= 5 },
  { id: 2, description: "Your password must include a number", validate: (pwd) => /\d/.test(pwd) },
  { id: 3, description: "Your password must include an uppercase letter", validate: (pwd) => /[A-Z]/.test(pwd) },
  { id: 4, description: "Your password must include a special character", validate: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  {
    id: 5, description: "The digits in your password must add up to 25", validate: (pwd) => {
      const digits = pwd.replace(/\D/g, "");
      const sum = digits.split("").reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      return sum === 25;
    }
  },
  { id: 6, description: "Your password must include a month of the year", validate: (pwd) => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(pwd) },
  { id: 7, description: "Your password must include a Roman numeral", validate: (pwd) => /[IVXLCDM]/.test(pwd) },
  { id: 8, description: "Your password must include the first five digits of Pi (3.1415)", validate: (pwd) => /3\.1415/.test(pwd) },
  { id: 9, description: "Your password must include a simple math expression", validate: (pwd) => /\d+\s*[\+\-\*\/]\s*\d+\s*=\s*\d+/.test(pwd) },
  { id: 10, description: "Your password must include one of the following words: ", validate: (pwd, randomWords) => randomWords.some(word => pwd.toLowerCase().includes(word.toLowerCase())), randomWords: [] },
  { id: 11, description: "All the vowels should be capital", validate: (pwd) => !/[aeiou]/.test(pwd) && /[AEIOU]/.test(pwd) },
  { id: 12, description: "Your password is not strong enough🏋️ [the password must include this emoji🏋️ three times]", validate: (pwd) => (pwd.match(/🏋️/g) || []).length === 3 },
  { id: 13, description: "Your password must include one of these sentences: ", validate: (pwd, randomSentences) => randomSentences.some(sentence => pwd.toLowerCase().includes(sentence.toLowerCase())), randomSentences: [] },
  { id: 14, description: "Your password must include a leap year", validate: (pwd) => /([0-9]{4})/.test(pwd) && (pwd.match(/([0-9]{4})/g).some(year => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) }
];

// Generate three random words for the user to include in their password
const generateRandomWords = () => {
  const words = [
    "ephemeral", "cacophony", "sonder", "ineffable", "juxtaposition", "serendipity",
    "sonder", "nefarious", "elucidate", "perspicacious", "sonder", "ubiquitous",
    "zephyr", "supercilious", "iridescent", "recalcitrant", "inevitable", "lugubrious",
    "soliloquy", "epistemology", "recondite", "sonder", "panacea", "sonder", "melancholy",
    "quixotic", "mellifluous", "zeitgeist", "exacerbate", "obfuscate", "idiosyncratic",
    "unfathomable", "disenfranchise", "intransigent", "phantasmagoria", "limerence",
    "threnody", "esoteric", "camaraderie", "ethereal", "numinous", "precipice", "plethora",
    "vociferous", "flabbergasted", "perspicuity", "conundrum", "paradigm", "quagmire",
    "reverberate", "apocryphal", "inscrutable", "luminous", "epistolary"
  ];
  const shuffled = words.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Generate two random three-word sentences for the user to include in their password
const generateRandomSentences = () => {
  const words = ["blue", "green", "yellow", "happy", "sad", "excited", "jump", "run", "swim", "cat", "dog", "mouse", "car", "bike", "boat"];
  const shuffledWords = words.sort(() => 0.5 - Math.random());
  return [
    `${shuffledWords[0]} ${shuffledWords[1]} ${shuffledWords[2]}`,
    `${shuffledWords[3]} ${shuffledWords[4]} ${shuffledWords[5]}`
  ];
};

const PasswordPage = () => {
  const [password, setPassword] = useState(""); // User-entered password
  const [confirmPassword, setConfirmPassword] = useState(""); // User-confirmed password
  const [visibleRules, setVisibleRules] = useState([1]); // List of rules to display
  const [completedRules, setCompletedRules] = useState([]); // List of completed rules
  const [showConfirm, setShowConfirm] = useState(false); // Show confirmation input or not
  const [startTime, setStartTime] = useState(null); // Start time for password entry
  const [completionTime, setCompletionTime] = useState(null); // Completion time for password entry
  const [randomWords, setRandomWords] = useState([]); // Random words for rule 10
  const [randomSentences, setRandomSentences] = useState([]); // Random sentences for rule 13
  const [showCompletedPage, setShowCompletedPage] = useState(false); // Show the completed page or not

  useEffect(() => {
    // Generate random words and set them in the rules
    const words = generateRandomWords();
    setRandomWords(words);
    const randomWordsRuleIndex = rules.findIndex(rule => rule.id === 10);
    rules[randomWordsRuleIndex].description += words.join(", ");
    rules[randomWordsRuleIndex].randomWords = words;

    // Generate random sentences and set them in the rules
    const sentences = generateRandomSentences();
    setRandomSentences(sentences);
    const randomSentencesRuleIndex = rules.findIndex(rule => rule.id === 13);
    rules[randomSentencesRuleIndex].description += sentences.join(" or ");
    rules[randomSentencesRuleIndex].randomSentences = sentences;
  }, []);

  // Handle password input change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    if (!startTime) {
      setStartTime(new Date().getTime());
    }
    setPassword(newPassword);

    const newCompletedRules = [];
    const newVisibleRules = [...visibleRules];

    // Check rules sequentially for the first time they appear
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      const isValid = rule.randomWords
        ? rule.validate(newPassword, rule.randomWords)
        : rule.randomSentences
          ? rule.validate(newPassword, rule.randomSentences)
          : rule.validate(newPassword);
      if (isValid) {
        newCompletedRules.push(rule.id);
        if (!newVisibleRules.includes(rule.id + 1) && rule.id + 1 <= rules.length) {
          newVisibleRules.push(rule.id + 1);
        }
      } else {
        break; // Stop at the first rule that fails for sequential check
      }
    }

    // Validate already visible rules in any order
    for (let i = 0; i < visibleRules.length; i++) {
      const rule = rules[visibleRules[i] - 1];
      const isValid = rule.randomWords
        ? rule.validate(newPassword, rule.randomWords)
        : rule.randomSentences
          ? rule.validate(newPassword, rule.randomSentences)
          : rule.validate(newPassword);
      if (isValid && !newCompletedRules.includes(rule.id)) {
        newCompletedRules.push(rule.id);
      }
    }

    setCompletedRules(newCompletedRules);
    setVisibleRules(newVisibleRules);


    if (newCompletedRules.length === rules.length) {
      setCompletionTime(new Date().getTime());
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
    }
  };

  // Handle confirmation password input change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Handle confirm password submission
  const handleConfirmSubmit = () => {
    if (password === confirmPassword) {
      const endTime = new Date().getTime();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      setCompletionTime(endTime);
      setShowCompletedPage(true);
    } else {
      alert("Passwords do not match. Please try again.");
      setConfirmPassword("");
    }
  };

  // Sort rules: completed rules move to the bottom, incomplete rules stay at the top
  const sortedRules = [...visibleRules].sort((a, b) => {
    const aCompleted = completedRules.includes(a);
    const bCompleted = completedRules.includes(b);
    return bCompleted - aCompleted || a - b;
  }).map(id => rules[id - 1]);

  return (
    <div className="password-page">
      {showCompletedPage ? (
        <CompletedPage passwordLength={password.length} timeTaken={(completionTime - startTime) / 1000} />
      ) : (
        <>
          <h1>Password Game</h1>
          <input
            type="text"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            className="password-input"
          />

          <div className="completed-rules-container">
            {!showConfirm &&
              sortedRules.map((rule) => (
                <div key={rule.id} className={`rule ${completedRules.includes(rule.id) ? "completed" : "failed"}`}>
                  <div className="rule-header">
                    {completedRules.includes(rule.id) ? "✔️" : "❌"} Rule {rule.id}
                  </div>
                  <div className="rule-description">
                    {rule.description}
                  </div>
                </div>
              ))
            }
          </div>

          {showConfirm && (
            <div className="confirm-password">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="password-input"
              />
              <button onClick={handleConfirmSubmit} className="password-button">Submit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PasswordPage;
