import React, { useState, useRef, FormEvent } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface ScrapState {
  name: boolean;
  email: boolean;
  message: boolean;
}

interface ValidationState {
  name: boolean | null;
  email: boolean | null;
  message: boolean | null;
}

const PaperTearContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const [tornScraps, setTornScraps] = useState<ScrapState>({
    name: false,
    email: false,
    message: false,
  });

  const [validation, setValidation] = useState<ValidationState>({
    name: null,
    email: null,
    message: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (field: keyof FormState, value: string): boolean => {
    switch (field) {
      case "name":
        return value.trim().length >= 2;
      case "email":
        return validateEmail(value.trim());
      case "message":
        return value.trim().length >= 10;
      default:
        return false;
    }
  };

  const handleScrapClick = (field: keyof ScrapState) => {
    setTornScraps((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputBlur = (field: keyof FormState) => {
    const value = formData[field];
    const isValid = validateField(field, value);
    setValidation((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateField("name", formData.name);
    const emailValid = validateField("email", formData.email);
    const messageValid = validateField("message", formData.message);

    setValidation({
      name: nameValid,
      email: emailValid,
      message: messageValid,
    });

    if (!nameValid || !emailValid || !messageValid) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="neobrutalist-contact-container">
        <div className="success-message" role="alert" aria-live="polite">
          <h2>THANK YOU – WE HAVE YOUR REQUEST!</h2>
        </div>
        <style>{`
          .neobrutalist-contact-container {
            min-height: 100vh;
            background-color: #EEEEEE;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: 'Courier New', monospace;
          }
          
          .success-message {
            background-color: #F8F8F8;
            border: 4px solid #000;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 8px 8px 0px #000;
            transform: rotate(-2deg);
            animation: successPulse 2s ease-in-out infinite;
          }
          
          .success-message h2 {
            font-size: clamp(24px, 5vw, 48px);
            font-weight: 900;
            color: #000;
            margin: 0;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          
          @keyframes successPulse {
            0%, 100% { transform: rotate(-2deg) scale(1); }
            50% { transform: rotate(-2deg) scale(1.05); }
          }
          
          @media (max-width: 768px) {
            .success-message {
              padding: 40px 20px;
              transform: rotate(-1deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="neobrutalist-contact-container">
      <div className="form-wrapper">
        <h1 className="form-title">CONTACT US</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
          {/* Name Scrap */}
          <div className="field-container">
            {!tornScraps.name ? (
              <div
                className="paper-scrap name-scrap"
                onClick={() => handleScrapClick("name")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleScrapClick("name")}
              >
                <span className="scrap-label">NAME</span>
              </div>
            ) : (
              <div className="input-container">
                <label htmlFor="name" className="visually-hidden">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onBlur={() => handleInputBlur("name")}
                  className={`contact-input ${validation.name === true ? "valid" : validation.name === false ? "invalid" : ""}`}
                  placeholder="Your name..."
                  required
                  aria-describedby="name-error"
                />
                {validation.name === false && (
                  <span id="name-error" className="error-text">
                    Name must be at least 2 characters
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Email Scrap */}
          <div className="field-container">
            {!tornScraps.email ? (
              <div
                className="paper-scrap email-scrap"
                onClick={() => handleScrapClick("email")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleScrapClick("email")
                }
              >
                <span className="scrap-label">EMAIL</span>
              </div>
            ) : (
              <div className="input-container">
                <label htmlFor="email" className="visually-hidden">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => handleInputBlur("email")}
                  className={`contact-input ${validation.email === true ? "valid" : validation.email === false ? "invalid" : ""}`}
                  placeholder="your@email.com"
                  required
                  aria-describedby="email-error"
                />
                {validation.email === false && (
                  <span id="email-error" className="error-text">
                    Please enter a valid email address
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Message Scrap */}
          <div className="field-container">
            {!tornScraps.message ? (
              <div
                className="paper-scrap message-scrap"
                onClick={() => handleScrapClick("message")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleScrapClick("message")
                }
              >
                <span className="scrap-label">MESSAGE</span>
              </div>
            ) : (
              <div className="input-container">
                <label htmlFor="message" className="visually-hidden">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  onBlur={() => handleInputBlur("message")}
                  className={`contact-input message-input ${validation.message === true ? "valid" : validation.message === false ? "invalid" : ""}`}
                  placeholder="Your message..."
                  required
                  rows={6}
                  aria-describedby="message-error"
                />
                {validation.message === false && (
                  <span id="message-error" className="error-text">
                    Message must be at least 10 characters
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "submitting" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
          </button>
        </form>
      </div>

      <style>{`
        .neobrutalist-contact-container {
          min-height: 100vh;
          background-color: #EEEEEE;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Courier New', monospace;
        }
        
        .form-wrapper {
          width: 100%;
          max-width: 600px;
        }
        
        .form-title {
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 900;
          color: #000;
          text-align: center;
          margin-bottom: 40px;
          letter-spacing: 4px;
          text-transform: uppercase;
          text-shadow: 4px 4px 0px #FF00FF;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .field-container {
          position: relative;
          min-height: 80px;
        }
        
        .paper-scrap {
          background-color: #F8F8F8;
          border: 3px solid #000;
          padding: 20px;
          cursor: pointer;
          transform: rotate(-1deg);
          box-shadow: 6px 6px 0px #000;
          transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
        }
        
        .paper-scrap::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 0;
          right: 0;
          height: 15px;
          background-color: #F8F8F8;
          clip-path: polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%);
          border-left: 3px solid #000;
          border-right: 3px solid #000;
        }
        
        .paper-scrap:hover {
          transform: rotate(-1deg) scale(1.02);
          box-shadow: 8px 8px 0px #000;
        }
        
        .paper-scrap:active {
          transform: rotate(-1deg) translateY(50px) scale(0.8);
          opacity: 0;
        }
        
        .name-scrap { transform: rotate(1deg); }
        .email-scrap { transform: rotate(-2deg); }
        .message-scrap { transform: rotate(1.5deg); }
        
        .scrap-label {
          font-size: 18px;
          font-weight: 900;
          color: #000;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        
        .input-container {
          animation: inputSlideIn 300ms ease-out;
        }
        
        .contact-input {
          width: 100%;
          padding: 15px;
          border: 3px solid #000;
          background-color: #F8F8F8;
          font-family: 'Courier New', monospace;
          font-size: 16px;
          font-weight: 600;
          color: #000;
          transition: border-color 250ms ease;
          box-shadow: 4px 4px 0px #000;
        }
        
        .contact-input:focus {
          outline: none;
          border-color: #FF0000;
        }
        
        .contact-input.valid {
          animation: validFlash 150ms ease;
        }
        
        .contact-input.invalid {
          animation: invalidFlash 150ms ease;
        }
        
        .message-input {
          resize: vertical;
          min-height: 120px;
        }
        
        .submit-button {
          background-color: #FF00FF;
          border: 3px solid #000;
          padding: 20px 40px;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          font-weight: 900;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          box-shadow: 6px 6px 0px #000;
          transition: all 200ms ease;
          transform: rotate(-1deg);
        }
        
        .submit-button:hover {
          box-shadow: 0 0 20px #39FF14, 6px 6px 0px #000;
          background-color: #FF00FF;
        }
        
        .submit-button:active {
          animation: buttonClickFill 400ms ease;
        }
        
        .submit-button.submitting {
          background-color: #FF0000;
          color: #FFF;
          cursor: not-allowed;
        }
        
        .error-text {
          color: #FF0000;
          font-size: 12px;
          font-weight: 700;
          margin-top: 5px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        @keyframes inputSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes validFlash {
          0%, 100% { border-color: #000; }
          50% { border-color: #A6FFCB; box-shadow: 0 0 15px #A6FFCB, 4px 4px 0px #000; }
        }
        
        @keyframes invalidFlash {
          0%, 100% { border-color: #000; }
          50% { border-color: #00FFFF; box-shadow: 0 0 15px #00FFFF, 4px 4px 0px #000; }
        }
        
        @keyframes buttonClickFill {
          0% { background-color: #FF00FF; }
          50% { background-color: #FF0000; transform: rotate(-1deg) scale(0.95); }
          100% { background-color: #FF00FF; }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .neobrutalist-contact-container {
            padding: 15px;
          }
          
          .form-title {
            margin-bottom: 30px;
            letter-spacing: 2px;
          }
          
          .contact-form {
            gap: 20px;
          }
          
          .field-container {
            min-height: 70px;
          }
          
          .paper-scrap {
            padding: 15px;
          }
          
          .scrap-label {
            font-size: 16px;
            letter-spacing: 1px;
          }
          
          .contact-input {
            padding: 12px;
            font-size: 14px;
          }
          
          .submit-button {
            padding: 15px 30px;
            font-size: 16px;
            letter-spacing: 1px;
          }
        }
        
        @media (max-width: 480px) {
          .paper-scrap {
            padding: 12px;
          }
          
          .scrap-label {
            font-size: 14px;
          }
          
          .contact-input {
            padding: 10px;
            font-size: 14px;
          }
          
          .submit-button {
            padding: 12px 24px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default PaperTearContactForm;
