import React from 'react';
import { ContactAPIResponse, normalizeContact } from 'js/components/detailPage/ContributorsTable/utils';
import { validateAndFormatOrcidId } from 'js/helpers/functions';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';

function CorrespondingAuthorsList({ contacts }: { contacts: ContactAPIResponse[] }) {
  const normalizedContacts = contacts.map((contact) => normalizeContact(contact));
  return (
    <BulletedList>
      {normalizedContacts.map(({ name, orcid }) => {
        const validatedOrcid = validateAndFormatOrcidId(orcid);
        return (
          <BulletedListItem key={name}>
            {name}
            &nbsp;
            {validatedOrcid && (
              <OutboundIconLink href={`https://orcid.org/${validatedOrcid}`}>{validatedOrcid}</OutboundIconLink>
            )}
          </BulletedListItem>
        );
      })}
    </BulletedList>
  );
}

export default CorrespondingAuthorsList;
