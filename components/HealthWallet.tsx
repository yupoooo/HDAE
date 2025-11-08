import React, { useState } from 'react';
import { MOCK_CREDENTIALS } from '../constants';
import type { VerifiableCredential } from '../types';
import { CredentialCard } from './CredentialCard';
import { ShareModal } from './ShareModal';
import { WalletIcon } from './icons/Icons';

export const HealthWallet: React.FC = () => {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>(MOCK_CREDENTIALS);
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null);

  const handleShare = (credential: VerifiableCredential) => {
    setSelectedCredential(credential);
  };

  const handleCloseModal = () => {
    setSelectedCredential(null);
  };

  const handleConfirmShare = (recipient: string, expiry: string) => {
    if (selectedCredential) {
      setCredentials(prev =>
        prev.map(c =>
          c.id === selectedCredential.id
            ? { ...c, sharedWith: { recipient, expiry } }
            : c
        )
      );
    }
    handleCloseModal();
  };

  const handleRevoke = (credentialId: string) => {
    setCredentials(prev =>
      prev.map(c =>
        c.id === credentialId ? { ...c, sharedWith: undefined } : c
      )
    );
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <WalletIcon className="w-8 h-8 ml-3 text-teal-500" />
            محفظة الصحة السيادية (SSI)
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            أنت تملك بياناتك الصحية وتتحكم فيها. شاركها بأمان، وفقًا لشروطك.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">شهاداتك الموثقة القابلة للتحقق</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map(cred => (
              <CredentialCard
                key={cred.id}
                credential={cred}
                onShare={handleShare}
                onRevoke={handleRevoke}
              />
            ))}
          </div>
        </div>
      </div>
      
      {selectedCredential && (
        <ShareModal
          credential={selectedCredential}
          onClose={handleCloseModal}
          onConfirm={handleConfirmShare}
        />
      )}
    </>
  );
};
