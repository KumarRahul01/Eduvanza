import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// eslint-disable-next-line react/prop-types
const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <ReactQuill
      theme="snow"
      placeholder="Enter details about your course here"
      // eslint-disable-next-line react/prop-types
      value={input.description}
      onChange={handleChange}
    />
  );
};
export default RichTextEditor;
