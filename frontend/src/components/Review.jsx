import React from 'react';

function Review() {
  const [review, setReview] = React.useState('');
  const [reviewed, setReviewed] = React.useState(false);

  const onChange = (e) => {
    setReview(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('rating');
    setReviewed(true);
  };

  return (
    <>
      {reviewed ? null : (
        <div className="form">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="review"
                name="review"
                value={review}
                placeholder="Enter your review"
                onChange={onChange}
              />
            </div>
            <div className="form-group"></div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Review;
