import { withRichForm } from "components/rich-form/RichForm";

export const CreatePost = () => {
  const formInputs = [
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "text",
    },
  ];
  const RichForm = () =>
    withRichForm("http://localhost:8000/api/posts", formInputs)();
  return (
    <div>
      <RichForm />
      tuu
    </div>
  );
};
