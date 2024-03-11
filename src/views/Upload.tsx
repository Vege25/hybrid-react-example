import {useState} from 'react';
import {useForm} from '../hooks/FormHooks';
import {useFile, useMedia} from '../hooks/apiHooks';
import {useNavigate} from 'react-router-dom';

// Upload.tsx
const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const {postMedia} = useMedia();
  const {postFile} = useFile();
  const navigate = useNavigate();
  const initValues = {
    title: '',
    description: '',
  };

  const doUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !file) {
        return;
      }
      const fileResult = await postFile(file, token);
      console.log('fileresult', fileResult);
      const mediaResult = await postMedia(fileResult, inputs, token);
      console.log(mediaResult);
      navigate('/');
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  // Upload.tsx
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doUpload,
    initValues,
  );
  return (
    <>
      <div className="mt-4 flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg border p-4 shadow-md">
          <h2 className="mb-4 text-center text-2xl font-bold">Upload</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600"
              >
                Title
              </label>
              <input
                name="title"
                type="text"
                id="title"
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description
              </label>
              <textarea
                name="description"
                rows={5}
                id="description"
                onChange={handleInputChange}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-600"
              >
                File
              </label>
              <input
                name="file"
                type="file"
                id="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-300 focus:outline-none focus:ring"
              />
            </div>
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : 'https://via.placeholder.com/200?text=Choose+image'
              }
              alt="preview"
              width="200"
              className="mt-4"
            />
            <button
              type="submit"
              disabled={file && inputs.title.length > 3 ? false : true}
              className="w-full rounded-md bg-blue-500 p-2 text-white disabled:opacity-50"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Upload;
