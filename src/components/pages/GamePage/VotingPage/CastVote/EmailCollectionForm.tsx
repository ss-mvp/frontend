import ConvertKitForm from 'convertkit-react';
import React from 'react';

const convertKitProps = {
  className: 'ck-fm',
  formId: 1831649,
  showLabels: true,
  emailLabel: 'Email',
  emailPlaceholder: null,
  nameLabel: 'First Name',
  namePlaceholder: null,
};

const EmailCollectionForm = (): React.ReactElement => {
  return (
    <div className="email-collection">
      <h2>Find Out Who Wins!</h2>
      <ConvertKitForm {...convertKitProps} />
    </div>
  );
};

export default EmailCollectionForm;
