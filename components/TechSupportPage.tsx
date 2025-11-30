import React from 'react';

const FormField: React.FC<{ id: string; label: string; type?: string; placeholder: string; required?: boolean; as?: 'input' | 'textarea' | 'select'; options?: string[] }> = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  as = 'input',
  options = [],
}) => {
  const commonProps = {
    id,
    name: id,
    className: "mt-2 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-colors",
    placeholder,
    required,
  };

  const renderInput = () => {
    switch (as) {
      case 'textarea':
        return <textarea {...commonProps} rows={5}></textarea>;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="" disabled>{placeholder}</option>
            {options.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        );
      default:
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};


const TechSupportPage: React.FC = () => {
  const issueTypes = [
    'Account & Login Issues',
    'Bug Report',
    'Feature Request',
    'General Feedback',
    'Event Question',
    'Other'
  ];

  return (
    <section className="bg-white py-32 pt-48 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-7xl font-medium text-gray-900 leading-tight tracking-tighter">
          Contact Support
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We're here to help. Fill out the form below and a member of our team will get back to you as soon as possible.
        </p>
      </div>
      
      <form className="mt-16 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-12 text-left">
          <h2 className="text-2xl font-semibold text-black">
            Support Request Form
          </h2>
          <p className="text-gray-600 mt-2">
            Please provide as much detail as possible so we can best assist you.
          </p>
          
          <div className="mt-8 border-t border-gray-200 pt-8 space-y-6">
            <FormField
              id="name"
              label="First and Last Name"
              placeholder="Enter your full name"
              required
            />
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />
            <FormField
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="(123) 456-7890 (Optional)"
            />
             <FormField
              id="issueType"
              label="What can we help you with?"
              as="select"
              placeholder="Select an issue type"
              options={issueTypes}
              required
            />
            <FormField
              id="description"
              label="Detailed Description"
              as="textarea"
              placeholder="Please describe the issue you're experiencing..."
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Submit Request
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default TechSupportPage;