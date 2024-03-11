import {useEffect, useRef} from 'react';
import {useCommentStore} from '../store';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useUserContext} from '../hooks/contextHooks';
import {useForm} from '../hooks/FormHooks';
import {useComment} from '../hooks/apiHooks';
import UserProfileIcon from './UserProfileIcon';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const {comments, setComments} = useCommentStore();
  const {user} = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);
  const {getCommentsByMediaId, postComment} = useComment();

  const initValues = {comment_text: ''};

  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postComment(inputs.comment_text, item.media_id, token);
      await getComments();
      // resetoi lomake
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('postComment failed', error);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doComment,
    initValues,
  );

  const getComments = async () => {
    try {
      const comments = await getCommentsByMediaId(item.media_id);
      setComments(comments);
    } catch (error) {
      console.error('getComments failed', error);
      setComments([]);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {user && (
        <div className="w-2/3">
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="flex w-full items-center">
              <div>
                <UserProfileIcon userInitial={user.username.charAt(0)} />
              </div>
              <input
                className="m-3 w-full rounded-md border border-slate-500 p-3 text-white"
                name="comment_text"
                required
                placeholder="Add comment"
                type="text"
                id="comment"
                onChange={handleInputChange}
              />
              <button
                className="m-3 w-1/4 scale-95 rounded-md bg-slate-700 p-3 transition-all duration-300 ease-in-out hover:scale-100"
                type="submit"
              >
                <i className="fa-solid fa-paper-plane text-xl"></i>
              </button>
            </div>
          </form>
        </div>
      )}
      {comments && comments.length > 0 && (
        <>
          <h3 className="text-xl font-bold">Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li className="mb-2" key={comment.comment_id}>
                <div className="rounded-md text-slate-100">
                  <span className="ml-2">{comment.comment_text}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Comments;
