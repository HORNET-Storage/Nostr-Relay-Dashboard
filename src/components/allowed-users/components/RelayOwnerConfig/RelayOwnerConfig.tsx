import React, { useState, useEffect } from 'react';
import { Input, Alert, Button, Space, Typography, message } from 'antd';
import { CheckOutlined, UserOutlined, SaveOutlined } from '@ant-design/icons';
import { AllowedUsersSettings, RelayOwner } from '@app/types/allowedUsers.types';
import { getRelayOwner, setRelayOwner, removeRelayOwner } from '@app/api/allowedUsers.api';
import { nip19 } from 'nostr-tools';
import * as S from './RelayOwnerConfig.styles';

const { Text } = Typography;

interface RelayOwnerConfigProps {
  settings: AllowedUsersSettings;
  onSettingsChange: (settings: AllowedUsersSettings) => void;
  disabled?: boolean;
}

export const RelayOwnerConfig: React.FC<RelayOwnerConfigProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  const [npubValue, setNpubValue] = useState('');
  const [currentOwner, setCurrentOwner] = useState<RelayOwner | null>(null);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCurrentOwner();
  }, []);

  const loadCurrentOwner = async () => {
    try {
      setLoading(true);
      const response = await getRelayOwner();
      
      if (response.relay_owner) {
        setCurrentOwner(response.relay_owner);
        try {
          const npubEncoded = nip19.npubEncode(response.relay_owner.npub);
          setNpubValue(npubEncoded);
        } catch (error) {
          console.error('Failed to encode npub:', error);
          setNpubValue(response.relay_owner.npub);
        }
        setIsAutoDetected(false);
      } else {
        setCurrentOwner(null);
        setNpubValue('');
        setIsAutoDetected(false);
      }
    } catch (error) {
      console.error('Failed to load current owner:', error);
      message.error('Failed to load relay owner');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOwner = async () => {
    if (!validateNpub(npubValue)) {
      message.error('Please enter a valid NPUB');
      return;
    }

    try {
      setSaving(true);
      
      let hexValue = npubValue;
      try {
        if (npubValue.startsWith('npub1')) {
          const decoded = nip19.decode(npubValue);
          hexValue = decoded.data as string;
        }
      } catch (error) {
        console.error('Failed to decode npub:', error);
        message.error('Invalid NPUB format');
        return;
      }
      
      await setRelayOwner({ npub: hexValue });
      await loadCurrentOwner();
      setIsAutoDetected(false);
      message.success('Relay owner set successfully');
      
    } catch (error) {
      console.error('❌ [RelayOwnerConfig] Failed to save owner:', error);
      message.error('Failed to save relay owner');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveOwner = async () => {
    if (!currentOwner) return;

    try {
      setSaving(true);
      await removeRelayOwner();
      setCurrentOwner(null);
      setNpubValue('');
      message.success('Relay owner cleared successfully');
    } catch (error) {
      console.error('Failed to remove owner:', error);
      message.error('Failed to remove relay owner');
    } finally {
      setSaving(false);
    }
  };

  const validateNpub = (value: string): boolean => {
    if (!value) return false;
    return value.startsWith('npub1') && value.length === 63;
  };

  const isValid = validateNpub(npubValue);
  // Compare with the current encoded npub value
  const currentNpubEncoded = currentOwner ? 
    (() => {
      try {
        return nip19.npubEncode(currentOwner.npub);
      } catch {
        return currentOwner.npub;
      }
    })() : '';
  const hasChanges = npubValue !== currentNpubEncoded;

  return (
    <S.Container>
      <Alert
        message="Only-Me Mode Configuration"
        description="In only-me mode, only the relay owner can write to this relay. Set your NPUB below to identify yourself as the owner."
        type="info"
        showIcon
        style={{
          marginBottom: '1.5rem',
          backgroundColor: 'rgba(0, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 255, 0.15)',
          color: '#d9d9d9'
        }}
      />

      <S.NpubSection>
        <S.SectionTitle>
          <UserOutlined /> Relay Owner
        </S.SectionTitle>
        
        <div>
          <S.SectionDescription>
            {currentOwner ? 'Current relay owner:' : 'Set your NPUB to identify yourself as the relay operator:'}
          </S.SectionDescription>
          
          <S.InputContainer>
            <Input
              value={npubValue}
              onChange={(e) => setNpubValue(e.target.value)}
              placeholder="Enter your NPUB (e.g., npub1abc...def123)"
              disabled={disabled || loading}
              status={npubValue && !isValid ? 'error' : undefined}
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                backgroundColor: 'var(--background-color-secondary)',
                border: '1px solid var(--border-color-base)',
                color: 'var(--text-main-color)'
              }}
            />
          </S.InputContainer>
          
          <Space style={{ marginTop: '1rem' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveOwner}
              loading={saving}
              disabled={disabled || !hasChanges || !isValid}
            >
              {currentOwner ? 'Update Owner' : 'Set as Owner'}
            </Button>
            {currentOwner && (
              <Button
                danger
                onClick={handleRemoveOwner}
                loading={saving}
                disabled={disabled}
              >
                Remove Owner
              </Button>
            )}
          </Space>
        </div>

        {isAutoDetected && (
          <S.AutoDetectedIndicator>
            <CheckOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text style={{ color: '#52c41a', fontSize: '13px' }}>
              Auto-detected from Nosis
            </Text>
          </S.AutoDetectedIndicator>
        )}

        {npubValue && !isValid && (
          <S.ErrorText>
            Invalid NPUB format. Must start with &quot;npub1&quot; and be 63 characters long.
          </S.ErrorText>
        )}
      </S.NpubSection>
    </S.Container>
  );
};
