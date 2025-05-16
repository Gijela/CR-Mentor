import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import LoadingIcon from "../../icons/LoadingIcon";

interface FormInputProps {
  status: "submitted" | "streaming" | "ready" | "error";
  input: string;
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setManualStop: (value: boolean) => void;
  stop: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  status,
  input,
  handleSubmit,
  handleInputChange,
  setManualStop,
  stop,
}) => {
  return (
    <div className="mb-4 flex justify-center gap-2 px-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-3xl">
        <fieldset className="relative flex w-full">
          <textarea
            rows={4}
            autoFocus
            placeholder={
              status === "submitted"
                ? "Thinking, please wait..."
                : status === "streaming"
                ? "AI is typing..."
                : "Send a message..."
            }
            required
            value={input}
            onChange={handleInputChange}
            disabled={status === "submitted" || status === "streaming"}
            className="block w-full rounded-xl border border-gray-300 bg-gray-100 p-2 pr-12 outline-black dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            type="submit"
            disabled={status === "submitted"}
            onClick={(e) => {
              if (status === "streaming") {
                e.preventDefault();
                setManualStop(true);
                stop();
              }
            }}
            className="absolute bottom-2 right-2 rounded-full p-2 text-black hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-600 disabled:cursor-not-allowed"
          >
            {status === "submitted" || status === "streaming" ? (
              <LoadingIcon />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default FormInput;
