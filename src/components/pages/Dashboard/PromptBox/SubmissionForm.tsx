import React from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { prompts, submitModal } from '../../../../state';

import { Submissions } from '../../../../api';
import { upload } from '../../../../utils';

import { BarLoader } from 'react-spinners';

const SubmissionForm = (props: SubmissionFormProps): React.ReactElement => {
  const [file, setFile] = useRecoilState(submitModal.selected);
  const [preview, setPreview] = useRecoilState(submitModal.preview);
  const [error, setError] = useRecoilState(submitModal.error);
  const [loading, setLoading] = useRecoilState(submitModal.loading);
  const [complete, setComplete] = useRecoilState(submitModal.success);
  const promptId = useRecoilValue(prompts.promptId);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('No image selected!');
    } else if (!promptId) {
      // Couldn't load prompt info, please reset
      setError('Error occurred. Try again later.');
    } else {
      setLoading(true);
      try {
        // ALL GOOD TO UPLOAD!
        const base64Image = await upload.toBase64(file);
        if (!base64Image) {
          setError('Error occurred. Try again later.');
          // Error!
          return;
        }
        const reqBody = new FormData();
        reqBody.append('image', file);
        reqBody.append('promptId', promptId.toString());
        reqBody.append('base64Image', base64Image.toString());

        await Submissions.uploadSubmission(reqBody);
        setComplete(true);
      } catch (err) {
        if (err?.response?.data?.error) {
          if (err.response.data.error === 'Transcription error')
            setError('Picture must be of written text');
          else setError(err.response.data.error);
        } else {
          setError('An error occurred. Try again later');
        }
      }
      setLoading(false);
    }
  };

  const fileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const selection = fileList[0];
      if (selection) {
        if (!upload.isValidImage(selection)) {
          setError('Upload must be an image!');
        } else {
          setError(null);
          setFile(selection);
          setPreview(URL.createObjectURL(selection));
        }
      }
    }
  };

  return (
    <div className="submission-form">
      <h2>Submit a Story</h2>
      <form onSubmit={onSubmit}>
        {preview && (
          <div className="preview">
            <img src={preview} alt="Upload preview" />
            <div className={`loader${loading ? ' visible' : ''}`}>
              <BarLoader />
            </div>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {!complete && (
          // If the submission hasn't been processed successfully
          <>
            <label className={file ? 'selected' : ''}>
              {file ? 'Change Picture' : 'Select a Picture'}
              <input type="file" onChange={fileSelection} hidden />
            </label>
            <button type="submit">Submit</button>
          </>
        )}
      </form>
      {complete && (
        // Once the submission is done, show a button.
        <>
          <div className="success">Submission successful!</div>
          <button onClick={props.closeModal}>Back to Dashboard</button>
        </>
      )}
    </div>
  );
};

interface SubmissionFormProps {
  closeModal: () => void;
}

export default SubmissionForm;
