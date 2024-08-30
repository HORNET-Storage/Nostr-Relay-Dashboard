import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse, Select, Input, Checkbox, Typography } from 'antd';
import styled from 'styled-components';
import { BaseSwitch } from '@app/components/common/BaseSwitch/BaseSwitch';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { setMode } from '@app/store/slices/modeSlice';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Balance } from '@app/components/nft-dashboard/Balance/Balance';
import { TotalEarning } from '@app/components/nft-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/nft-dashboard/activityStory/ActivityStory';
import { useResponsive } from '@app/hooks/useResponsive';
import useRelaySettings from '@app/hooks/useRelaySettings';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import { themeObject } from '@app/styles/themes/themeVariables';
import { categories, noteOptions, appBuckets, Settings, Category } from '@app/constants/relaySettings';
const { Panel } = Collapse;
const StyledPanel = styled(Panel)``;
const { Option } = Select;

const RelaySettingsPage: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { relaySettings, fetchSettings, updateSettings, saveSettings } = useRelaySettings();
  const { isDesktop } = useResponsive();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const relaymode = useAppSelector((state) => state.mode.relayMode);

  const [storedDynamicKinds, setStoredDynamicKinds] = useState<string[]>(
    JSON.parse(localStorage.getItem('dynamicKinds') || '[]'),
  );
  const [storedAppBuckets, setStoredAppBuckets] = useState<string[]>(
    JSON.parse(localStorage.getItem('appBuckets') || '[]'),
  );

  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [newKind, setNewKind] = useState('');
  const [newBucket, setNewBucket] = useState('');
  const [blacklist, setBlacklist] = useState({
    kinds: [],
    photos: [],
    videos: [],
    gitNestr: [],
    audio: [],
  });

  const [settings, setSettings] = useState<Settings>({
    mode: JSON.parse(localStorage.getItem('relaySettings') || '{}').mode || relaymode || 'unlimited',
    protocol: ['WebSocket'],
    chunked: ['unchunked'],
    chunksize: '2',
    maxFileSize: 100,
    maxFileSizeUnit: 'MB',
    kinds: [],
    dynamicKinds: [],
    photos: [],
    videos: [],
    gitNestr: [],
    audio: [],
    appBuckets: [],
    dynamicAppBuckets: [],
    isKindsActive: true,
    isPhotosActive: true,
    isVideosActive: true,
    isGitNestrActive: true,
    isAudioActive: true,
  });
  const groupedNoteOptions = categories.map((category) => ({
    ...category,
    notes: noteOptions.filter((note) => note.category === category.id),
  }));

  useEffect(() => {
    console.log(settings);
    console.log(blacklist)
  }, [settings,blacklist]);
  const enterLoading = (index: number) => {
    setLoadings((loadings) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;
      return newLoadings;
    });
  };

  const exitLoading = (index: number) => {
    setLoadings((loadings) => {
      const newLoadings = [...loadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  };

  const photoFormatOptions = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'raw',
    'svg',
    'eps',
    'psd',
    'ai',
    'pdf',
    'webp',
  ].map((format) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color:
            settings.mode !== 'smart'
              ? themeObject[theme].textMain
              : relaySettings.isPhotosActive
              ? themeObject[theme].textMain
              : themeObject[theme].textLight,
        }}
        isActive={settings.mode !== 'smart' || '' ? true : settings.isPhotosActive}
      >
        {t(`checkboxes.${format}`)}
      </S.CheckboxLabel>
    ),
    value: format,
  }));

  const videoFormatOptions = ['avi', 'mp4', 'mov', 'wmv', 'mkv', 'flv', 'mpeg', '3gp', 'webm', 'ogg'].map((format) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color:
            settings.mode !== 'smart'
              ? themeObject[theme].textMain
              : relaySettings.isVideosActive
              ? themeObject[theme].textMain
              : themeObject[theme].textLight,
        }}
        isActive={settings.mode !== 'smart' ? true : settings.isVideosActive}
      >
        {t(`checkboxes.${format}`)}
      </S.CheckboxLabel>
    ),
    value: format,
  }));

  const appBucketOptions = appBuckets.map((bucket) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color:
            settings.mode !== 'smart'
              ? themeObject[theme].textMain
              : relaySettings.isKindsActive
              ? themeObject[theme].textMain
              : themeObject[theme].textLight,
        }}
        isActive={settings.mode !== 'smart' ? true : settings.isKindsActive} //TODO: isAppBucketActive
      >
        {bucket.label}
      </S.CheckboxLabel>
    ),
    value: bucket.id,
  }));

  const audioFormatOptions = [
    'mp3',
    'wav',
    'ogg',
    'flac',
    'aac',
    'wma',
    'm4a',
    'opus',
    'm4b',
    'midi',
    'mp4',
    'webm',
    '3gp',
  ].map((format) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color:
            settings.mode !== 'smart'
              ? themeObject[theme].textMain
              : relaySettings.isAudioActive
              ? themeObject[theme].textMain
              : themeObject[theme].textLight,
        }}
        isActive={settings.mode !== 'smart' ? true : settings.isAudioActive}
      >
        {t(`checkboxes.${format}`)}
      </S.CheckboxLabel>
    ),
    value: format,
  }));

  const gitNestrHkindOptions = [
    { value: 'Nostr/file_attachment' },
    { value: 'GitNestr/bundle_chain', description: 'Codebase Without Git Tree' },
    { value: 'GitNestr/archive_repo' },
    { value: 'GitNestr/encrypted_data' },
  ].map(({ value, description }) => ({
    label: (
      <S.CheckboxLabel
        style={{
          color:
            settings.mode !== 'smart'
              ? themeObject[theme].textMain
              : relaySettings.isGitNestrActive
              ? themeObject[theme].textMain
              : themeObject[theme].textLight,
        }}
        isActive={settings.mode !== 'smart' ? true : settings.isGitNestrActive}
      >
        {t(`checkboxes.${value}`)}
        {description && ` - ${description}`}
      </S.CheckboxLabel>
    ),
    value,
  }));

  const chunkSizeOptions = ['2', '4', '6', '8', '10', '12'];
  const maxFileSizeUnitOptions = ['MB', 'GB', 'TB'];

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'smart' : 'unlimited';
    updateSettings('mode', newMode);
    dispatch(setMode(newMode));
    console.log("changing mode")
    if (newMode === 'unlimited') {
      setBlacklist({
        kinds: [],
        photos: [],
        videos: [],
        gitNestr: [],
        audio: [],
      });
    }
  };

  const handleProtocolChange = (checkedValues: string[]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      protocol: checkedValues,
    }));
    updateSettings('protocol', checkedValues);
  };

  const handleBlacklistChange = (category: Category, checkedValues: string[]) => {
    console.log("changing blacklist")
    debugger
    const isDynamicKind = category === 'dynamicKinds' || category === 'appBuckets';
    if (isDynamicKind) {
      console.log("changing dynamic kind")
      setSettings((prevSettings) => {
        const updatedSettings = { ...prevSettings, [category]: checkedValues };
        updateSettings(category, checkedValues);
        return updatedSettings;
      });
      return;
    }
    setBlacklist((prevBlacklist) => ({
      ...prevBlacklist,
      [category]: checkedValues,
    }));
  };

  const handleChunkedChange = (checkedValues: string[]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      chunked: checkedValues,
    }));
    updateSettings('chunked', checkedValues);
  };

  const handleSettingsChange = (category: Category, checkedValues: string[]) => {
    console.log("changing settings", category, checkedValues) 
    if (settings.mode === 'unlimited') {
      handleBlacklistChange(category, checkedValues);
    } else {
      setSettings((prevSettings) => {
        const updatedSettings = { ...prevSettings, [category]: checkedValues };
        updateSettings(category, checkedValues);
        return updatedSettings;
      });
    }
  };

  const handleSwitchChange = (category: keyof Settings, value: boolean) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: value,
    }));
    updateSettings(category, value);
  };

  const handleChunkSizeChange = (value: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      chunksize: value,
    }));
    updateSettings('chunksize', value);
  };

  const handleMaxFileSizeChange = (value: number) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      maxFileSize: value,
    }));
    updateSettings('maxFileSize', value);
  };

  const handleMaxFileSizeUnitChange = (value: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      maxFileSizeUnit: value,
    }));
    updateSettings('maxFileSizeUnit', value);
  };

  const handleNewBucket = (bucket: string) => {
    const currentBuckets = settings.appBuckets.concat(storedAppBuckets);
    if (currentBuckets.includes(bucket)) {
      return;
    }
    setStoredAppBuckets((prevBuckets) => [...prevBuckets, bucket]);
    handleSettingsChange('dynamicAppBuckets', [...settings.dynamicAppBuckets, bucket]);
  };

  const handleRemovedBucket = (bucket: string) => {
    setStoredAppBuckets((prevBuckets) => prevBuckets.filter((b) => b !== bucket));
    handleSettingsChange(
      'appBuckets',
      settings.appBuckets.filter((b) => b !== bucket),
    );
  };

  const handleNewDynamicKind = (kind: string) => {
    const currentKinds = settings.dynamicKinds.concat(storedDynamicKinds);
    if (currentKinds.includes(kind)) {
      return;
    }
    setStoredDynamicKinds((prevKinds) => [...prevKinds, kind]);
    handleSettingsChange('dynamicKinds', [...settings.dynamicKinds, kind]);
  };
  const removeDynamicKind = (kind: string) => {
    setStoredDynamicKinds((prevKinds) => prevKinds.filter((k) => k !== kind));
    handleSettingsChange(
      'dynamicKinds',
      settings.dynamicKinds.filter((k) => k !== kind),
    );
  };

  const performSaveSettings = async () => {
    await Promise.all([
      updateSettings('kinds', settings.isKindsActive ? settings.kinds : []),
      updateSettings('dynamicKinds', settings.dynamicKinds),
      updateSettings('photos', settings.isPhotosActive ? settings.photos : []),
      updateSettings('videos', settings.isVideosActive ? settings.videos : []),
      updateSettings('gitNestr', settings.isGitNestrActive ? settings.gitNestr : []),
      updateSettings('audio', settings.isAudioActive ? settings.audio : []),
      updateSettings('protocol', settings.protocol),
      updateSettings('chunked', settings.chunked),
      updateSettings('maxFileSize', settings.maxFileSize),
      updateSettings('maxFileSizeUnit', settings.maxFileSizeUnit),
      // updateSettings('appBuckets', settings.appBuckets),
      //updateSettings('dynamicAppBuckets', settings.dynamicAppBuckets),
    ]);

    await saveSettings();
  };

  const onSaveClick = async () => {
    enterLoading(0);

    if (!settings.isKindsActive) {
      handleSettingsChange('kinds', []);
    }
    if (!settings.isPhotosActive) {
      handleSettingsChange('photos', []);
    }
    if (!settings.isVideosActive) {
      handleSettingsChange('videos', []);
    }
    if (!settings.isGitNestrActive) {
      handleSettingsChange('gitNestr', []);
    }
    if (!settings.isAudioActive) {
      handleSettingsChange('audio', []);
    }

    await performSaveSettings();
    exitLoading(0);
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (relaySettings) {
      setSettings({
        ...relaySettings,
        protocol: Array.isArray(relaySettings.protocol) ? relaySettings.protocol : [relaySettings.protocol],
        chunked: Array.isArray(relaySettings.chunked) ? relaySettings.chunked : [relaySettings.chunked],
      });
    }
  }, [relaySettings]);

  useEffect(() => {
    if(settings.mode === 'unlimited') return 
    console.log("resetting blacklist changing")
    setBlacklist({
      kinds: [],
      photos: [],
      videos: [],
      gitNestr: [],
      audio: [],
    });
  }, [settings.mode]);

  useEffect(() => {
    localStorage.setItem('appBuckets', JSON.stringify(storedAppBuckets));
  }, [storedAppBuckets]);
  useEffect(() => {
    localStorage.setItem('dynamicKinds', JSON.stringify(storedDynamicKinds));
  }, [storedDynamicKinds]);

  useEffect(() => {
    const updateDynamicKinds = async () => {
      await performSaveSettings();
    };

    if (settings.dynamicKinds && settings.dynamicKinds.length > 0) {
      updateDynamicKinds();
    }
  }, [settings.dynamicKinds]);

  const desktopLayout = (
    <BaseRow>
      <S.LeftSideCol xl={16} xxl={17} id="desktop-content">
        <BaseRow gutter={[60, 60]}>
          <BaseCol xs={24}>
            <S.HeadingContainer>
              <S.LabelSpan>{'Options'}</S.LabelSpan>
            </S.HeadingContainer>
            <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
              <StyledPanel header={'Network Rules'} key="protocol" className="centered-header">
                <S.Card>
                  <BaseCol span={24}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                      <S.LabelSpan style={{ marginBottom: '1rem' }}>{t('common.transportSetting')}</S.LabelSpan>
                      <Checkbox.Group
                        options={[
                          { label: 'WebSocket', value: 'WebSocket', style: { fontSize: '.85rem' } },
                          { label: 'Libp2p QUIC', value: 'QUIC', style: { fontSize: '.85rem' } },
                        ]}
                        value={settings.protocol}
                        className="custom-checkbox-group"
                        onChange={(checkedValues) => handleProtocolChange(checkedValues as string[])}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '10rem auto', // Adjust the width as needed
                        }}
                      />
                    </div>
                    <div style={{ borderTop: '1px solid #ccc', margin: '1rem 0' }}></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <S.LabelSpan style={{ marginBottom: '1rem' }}>{t('common.chunkedSetting')}</S.LabelSpan>{' '}
                      <Checkbox.Group
                        className="custom-checkbox-group"
                        options={[
                          { label: `Unchunked \u{1F338}`, value: 'unchunked', style: { fontSize: '.85rem' } },
                          { label: `Chunked \u{1F333}`, value: 'chunked', style: { fontSize: '.85rem' } },
                        ]}
                        value={settings.chunked}
                        onChange={(checkedValues) => handleChunkedChange(checkedValues as string[])}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '10rem auto', // Adjust the width as needed
                        }}
                      />
                    </div>
                    {settings.chunked.includes('unchunked') && (
                      <>
                        <div style={{ marginTop: '1.5rem' }}>
                          <strong>Max Unchunked File Size:</strong>
                          <S.Space />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                          <Input
                            type="number"
                            value={settings.maxFileSize}
                            onChange={(e) => handleMaxFileSizeChange(Number(e.target.value))}
                            style={{ width: 100 }}
                          />
                          <Select
                            className="custom-dropdown"
                            value={settings.maxFileSizeUnit}
                            onChange={handleMaxFileSizeUnitChange}
                            style={{ width: 100 }}
                          >
                            {maxFileSizeUnitOptions.map((unit) => (
                              <Option key={unit} value={unit}>
                                {unit}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </>
                    )}
                    {settings.chunked.includes('chunked') && (
                      <>
                        <div style={{ marginTop: '1rem' }}>
                          <strong>Max Chunked File Size:</strong>
                          <S.Space />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                          <Input
                            type="number"
                            value={settings.maxFileSize}
                            onChange={(e) => handleMaxFileSizeChange(Number(e.target.value))}
                            style={{ width: 100 }}
                          />
                          <Select
                            className="custom-dropdown"
                            value={settings.maxFileSizeUnit}
                            onChange={handleMaxFileSizeUnitChange}
                            style={{ width: 100 }}
                          >
                            {maxFileSizeUnitOptions.map((unit) => (
                              <Option key={unit} value={unit}>
                                {unit}
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </>
                    )}
                  </BaseCol>
                </S.Card>
              </StyledPanel>
            </Collapse>
            <Collapse style={{ padding: '1rem 0 1rem 0' }} bordered={false}>
              <StyledPanel header={'App Buckets'} key="appBuckets" className="centered-header">
                <S.Card>
                  <div className="flex-col w-full">
                    <BaseCheckbox.Group
                      style={{ paddingTop: '1rem', paddingLeft: '1rem', paddingBottom: '1rem' }}
                      className={`custom-checkbox-group grid-checkbox-group`}
                      onChange={(checkedValues) => handleSettingsChange('appBuckets', checkedValues as string[])}
                      options={appBucketOptions}
                    />

                    <S.InfoCard>
                      <S.InfoCircleOutlinedIcon />
                      <small style={{ color: themeObject[theme].textLight }}>
                        {
                          'Enabling buckets will organize data stored within the relay to quicken retrieval times for users. Disabling buckets will not turn off data storage.'
                        }
                      </small>
                    </S.InfoCard>
                    <S.NewBucketContainer>
                      <h3>{'Add an App Bucket'}</h3>
                      <div
                        style={{ display: 'flex' }}
                        className="custom-checkbox-group grid-checkbox-group large-label"
                      >
                        <Input
                          value={newBucket}
                          onChange={(e) => {
                            setNewBucket(e.target.value);
                          }}
                          placeholder="Enter new app bucket"
                        />
                        <BaseButton
                          onClick={() => {
                            if (newBucket) {
                              handleNewBucket(newBucket);
                              setNewBucket('');
                            }
                          }}
                        >
                          Add bucket
                        </BaseButton>
                      </div>
                      <BaseCheckbox.Group
                        style={{ paddingLeft: '1rem' }}
                        className={`custom-checkbox-group grid-checkbox-group large-label ${
                          storedAppBuckets?.length ? 'dynamic-group' : ''
                        } `}
                        value={settings.dynamicAppBuckets || []}
                        onChange={(checkedValues) =>
                          handleSettingsChange('dynamicAppBuckets', checkedValues as string[])
                        }
                      >
                        {(storedAppBuckets || []).map((bucket) => (
                          <div
                            style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
                            key={bucket}
                          >
                            <div className="checkbox-container">
                              <BaseCheckbox value={bucket} />
                              <S.CheckboxLabel
                                isActive={true}
                                style={{ fontSize: '1rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
                              >
                                {bucket}
                              </S.CheckboxLabel>
                            </div>
                            <BaseButton
                              style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
                              onClick={() => handleRemovedBucket(bucket)}
                            >
                              Remove
                            </BaseButton>
                          </div>
                        ))}
                      </BaseCheckbox.Group>
                    </S.NewBucketContainer>
                  </div>
                </S.Card>
              </StyledPanel>
            </Collapse>
          </BaseCol>
        </BaseRow>

        <BaseCol xs={24}>
          <S.SwitchContainer
            style={{
              width: '11rem',
              display: 'grid',
              paddingTop: '3rem',
              gap: '.5rem',
              gridTemplateColumns: '1fr 3fr',
              marginBottom: '1.5rem',
            }}
          >
            <S.LabelSpan>{t('common.serverSetting')}</S.LabelSpan>
            <S.LargeSwitch
              className="modeSwitch"
              checkedChildren="Strict"
              unCheckedChildren="Unlimited"
              checked={settings.mode === 'smart'}
              onChange={(e) => handleModeChange(e)}
            />
          </S.SwitchContainer>
          <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
            <StyledPanel
              header={settings.mode !== 'smart' ? `Blacklisted Kind Numbers` : 'Kind Numbers'}
              key="notes"
              className="centered-header"
            >
              <S.Card>
                <div className="flex-col w-full">
                  {settings.mode !== 'unlimited' && settings.mode !== '' && (
                    <div className="switch-container">
                      <BaseSwitch
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                        checked={settings.isKindsActive}
                        onChange={() => handleSwitchChange('isKindsActive', !settings.isKindsActive)}
                      />
                    </div>
                  )}
                  <BaseCheckbox.Group
                    className="large-label "
                    value={settings.mode == 'unlimited' ? blacklist.kinds : settings.kinds}
                    onChange={(checkedValues) => handleSettingsChange('kinds', checkedValues as string[])}
                    disabled={settings.mode !== 'smart' ? false : !settings.isKindsActive}
                  >
                    {groupedNoteOptions.map((group) => (
                      <div key={group.id} style={{ paddingBottom: '2rem' }}>
                        <h3 className="checkboxHeader w-full">{group.name}</h3>
                        <div className="custom-checkbox-group grid-checkbox-group large-label">
                          {group.notes.map((note) => (
                            <div className="checkbox-container" style={{ paddingLeft: '1rem' }} key={note.kindString}>
                              <BaseCheckbox
                                value={note.kindString}
                                className={settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''}
                                disabled={settings.mode !== 'smart' ? false : !settings.isKindsActive}
                              />

                              <S.CheckboxLabel
                                isActive={settings.mode !== 'smart' ? true : settings.isKindsActive}
                                style={{
                                  paddingRight: '.8rem',
                                  paddingLeft: '.8rem',
                                  color:
                                    settings.mode !== 'smart'
                                      ? themeObject[theme].textMain
                                      : relaySettings.isKindsActive
                                      ? themeObject[theme].textMain
                                      : themeObject[theme].textLight,
                                }}
                              >
                                {t(`kind${note.kind}`)} -{' '}
                                <span style={{ fontWeight: 'normal' }}>{note.description}</span>
                              </S.CheckboxLabel>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </BaseCheckbox.Group>
                  {settings.mode !== 'smart' && (
                    <div
                      style={{
                        padding: '1.5rem 0rem 0rem 0rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.5rem',
                      }}
                    >
                      <h3>{'Add to Blacklist'}</h3>
                      <div
                        style={{ display: 'flex' }}
                        className="custom-checkbox-group grid-checkbox-group large-label"
                      >
                        <Input
                          value={newKind}
                          onChange={(e) => setNewKind(e.target.value)}
                          placeholder="Enter new kind"
                        />
                        <BaseButton
                          onClick={() => {
                            if (newKind) {
                              handleNewDynamicKind(newKind);
                              setNewKind('');
                            }
                          }}
                        >
                          Add Kind
                        </BaseButton>
                      </div>
                      <BaseCheckbox.Group
                        style={{ paddingLeft: '1rem' }}
                        className={`custom-checkbox-group grid-checkbox-group large-label ${
                          storedDynamicKinds?.length ? 'dynamic-group ' : ''
                        }${settings.mode === 'unlimited' ? 'blacklist-mode-active ' : ''}`}
                        value={settings.dynamicKinds || []}
                        onChange={(checkedValues) => handleSettingsChange('dynamicKinds', checkedValues as string[])}
                      >
                        {(storedDynamicKinds || []).map((kind) => (
                          <div
                            style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
                            key={kind}
                          >
                            <div className="checkbox-container">
                              <BaseCheckbox
                                className={settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''}
                                value={kind}
                              />
                              <S.CheckboxLabel
                                isActive={true}
                                style={{ fontSize: '1rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
                              >
                                {`kind` + kind}
                              </S.CheckboxLabel>
                            </div>
                            <BaseButton
                              style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
                              onClick={() => removeDynamicKind(kind)}
                            >
                              Remove
                            </BaseButton>
                          </div>
                        ))}
                      </BaseCheckbox.Group>
                    </div>
                  )}
                </div>
              </S.Card>
            </StyledPanel>
          </Collapse>

          <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
            <StyledPanel
              header={settings.mode !== 'smart' ? `Blacklisted Photo Extension` : 'Photo Extensions'}
              key="2"
            >
              <S.Card>
                {settings.mode !== 'unlimited' && settings.mode !== '' && (
                  <div className="switch-container">
                    <BaseSwitch
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      checked={settings.isPhotosActive}
                      onChange={() => handleSwitchChange('isPhotosActive', !settings.isPhotosActive)}
                    />
                  </div>
                )}

                <BaseCheckbox.Group
                  className={`custom-checkbox-group grid-checkbox-group ${
                    settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                  }`}
                  options={photoFormatOptions}
                  value={settings.mode == 'unlimited' ? blacklist.photos : settings.photos}
                  onChange={(checkedValues) => handleSettingsChange('photos', checkedValues as string[])}
                  disabled={settings.mode !== 'smart' ? false : !settings.isPhotosActive}
                />
              </S.Card>
            </StyledPanel>
          </Collapse>
          <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
            <StyledPanel
              header={settings.mode !== 'smart' ? `Blacklisted Video Extensions` : 'Video Extensions'}
              key="3"
            >
              <S.Card>
                {settings.mode !== 'unlimited' && settings.mode !== '' && (
                  <div className="switch-container">
                    <BaseSwitch
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      checked={settings.isVideosActive}
                      onChange={() => handleSwitchChange('isVideosActive', !settings.isVideosActive)}
                    />
                  </div>
                )}

                <BaseCheckbox.Group
                  className={`custom-checkbox-group grid-checkbox-group ${
                    settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                  }`}
                  options={videoFormatOptions}
                  value={settings.mode == 'unlimited' ? blacklist.videos : settings.videos}
                  onChange={(checkedValues) => handleSettingsChange('videos', checkedValues as string[])}
                  disabled={settings.mode !== 'smart' ? false : !settings.isVideosActive}
                />
              </S.Card>
            </StyledPanel>
          </Collapse>
          {/*   <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
            <StyledPanel
              header={
                settings.mode === 'unlimited' ? `Blacklisted ${t('checkboxes.gitNestr')}` : t('checkboxes.gitNestr')
              }
              key="4"
            >
              <S.Card>
                <div>
                  <BaseSwitch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    checked={settings.isGitNestrActive}
                    onChange={() => handleSwitchChange('isGitNestrActive', !settings.isGitNestrActive)}
                  />
                </div>
                <BaseCheckbox.Group
                  className={`custom-checkbox-group grid-checkbox-group large-label ${
                    settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                  }`}
                  options={gitNestrHkindOptions}
                  value={settings.mode == 'unlimited' ? blacklist.gitNestr : settings.gitNestr}
                  onChange={(checkedValues) => handleSettingsChange('gitNestr', checkedValues as string[])}
                  disabled={!settings.isGitNestrActive}
                />
              </S.Card>
            </StyledPanel>
          </Collapse> */}
          <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
            <StyledPanel
              header={settings.mode !== 'smart' ? `Blacklisted Audio Extensions` : 'Audio Extensions'}
              key="5"
            >
              <S.Card>
                {settings.mode !== 'unlimited' && settings.mode !== '' && (
                  <div className="switch-container">
                    <BaseSwitch
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      checked={settings.isAudioActive}
                      onChange={() => handleSwitchChange('isAudioActive', !settings.isAudioActive)}
                    />
                  </div>
                )}
                <BaseCheckbox.Group
                  className={`custom-checkbox-group grid-checkbox-group ${
                    settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                  }`}
                  options={audioFormatOptions}
                  value={settings.mode == 'unlimited' ? blacklist.audio : settings.audio}
                  onChange={(checkedValues) => handleSettingsChange('audio', checkedValues as string[])}
                  disabled={settings.mode !== 'smart' ? false : !settings.isAudioActive}
                />
              </S.Card>
            </StyledPanel>
          </Collapse>
          <BaseButton
            style={{ marginTop: '2rem', paddingBottom: '1rem' }}
            type="primary"
            loading={loadings[0]}
            onClick={onSaveClick}
          >
            {t('buttons.saveSettings')}
          </BaseButton>
        </BaseCol>
      </S.LeftSideCol>
      <S.RightSideCol xl={8} xxl={7}>
        <div id="balance">
          <Balance />
        </div>
        <S.Space />
        <div id="total-earning">
          <TotalEarning />
        </div>
        <S.Space />
        <div id="activity-story">
          <ActivityStory />
        </div>
      </S.RightSideCol>
    </BaseRow>
  );

  const mobileAndTabletLayout = (
    <BaseRow gutter={[20, 24]}>
      <BaseCol span={24}>
        <S.HeadingContainer>
          <S.LabelSpan>{'Options'}</S.LabelSpan>
        </S.HeadingContainer>
        <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
          <StyledPanel header={'Network Options'} key="protocol" className="centered-header">
            <S.Card>
              <BaseCol span={24}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1rem' }}>
                  <S.LabelSpan style={{ marginBottom: '0.5rem' }}>{t('common.transportSetting')}</S.LabelSpan>
                  <Checkbox.Group
                    className="custom-checkbox-group"
                    options={[
                      { label: 'WebSocket', value: 'WebSocket', style: { fontSize: '.8rem' } },
                      { label: 'Libp2p QUIC', value: 'QUIC', style: { fontSize: '.8rem' } },
                    ]}
                    value={settings.protocol}
                    onChange={(checkedValues) => handleProtocolChange(checkedValues as string[])}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '9rem auto',
                      paddingRight: '0',
                      justifyContent: 'start',
                      fontSize: 'small',
                    }}
                  />
                </div>
                <div style={{ borderTop: '1px solid #ccc', margin: '1rem 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <S.LabelSpan style={{ marginBottom: '0.5rem' }}>{t('common.chunkedSetting')}</S.LabelSpan>
                  <Checkbox.Group
                    className="custom-checkbox-group"
                    options={[
                      {
                        label: `Unchunked \u{1F338}`,
                        value: 'unchunked',
                        style: { fontSize: '.8rem' },
                      },
                      { label: `Chunked \u{1F333}`, value: 'chunked', style: { fontSize: '.8rem' } },
                    ]}
                    value={settings.chunked}
                    onChange={(checkedValues) => handleChunkedChange(checkedValues as string[])}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '9rem auto',
                      paddingRight: '0',
                      justifyContent: 'start',
                      fontSize: 'small',
                    }}
                  />
                  {settings.chunked.includes('unchunked') && (
                    <>
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Max Unchunked File Size:</strong>
                        <S.Space />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <Input
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) => handleMaxFileSizeChange(Number(e.target.value))}
                          style={{ width: 100 }}
                        />
                        <Select
                          className="custom-dropdown"
                          value={settings.maxFileSizeUnit}
                          onChange={handleMaxFileSizeUnitChange}
                          style={{ width: 100 }}
                        >
                          {maxFileSizeUnitOptions.map((unit) => (
                            <Option key={unit} value={unit}>
                              {unit}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </>
                  )}
                  {settings.chunked.includes('chunked') && (
                    <>
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Max Chunked File Size:</strong>
                        <S.Space />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <Input
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) => handleMaxFileSizeChange(Number(e.target.value))}
                          style={{ width: 100 }}
                        />
                        <Select
                          className="custom-dropdown"
                          value={settings.maxFileSizeUnit}
                          onChange={handleMaxFileSizeUnitChange}
                          style={{ width: 100 }}
                        >
                          {maxFileSizeUnitOptions.map((unit) => (
                            <Option key={unit} value={unit}>
                              {unit}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </BaseCol>
            </S.Card>
          </StyledPanel>
        </Collapse>
        <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
          <StyledPanel header={'App Buckets'} key="appBuckets" className="centered-header">
            <S.Card>
              <div className="flex-col w-full">
                <BaseCheckbox.Group
                  style={{ padding: '1rem 0rem 1rem 1rem' }}
                  className={`custom-checkbox-group grid-mobile-checkbox-group `}
                  value={settings.appBuckets || []}
                  onChange={(checkedValues) => handleSettingsChange('appBuckets', checkedValues as string[])}
                  //disabled={settings.mode !== 'smart' ? false : !settings.isKindsActive}
                  options={appBucketOptions}
                />
                <S.InfoCard>
                  <S.InfoCircleOutlinedIcon />
                  <small style={{ color: themeObject[theme].textLight }}>
                    {
                      'Enabling buckets will organize data stored within the relay to quicken retrieval times for users. Disabling buckets will not turn off data storage.'
                    }
                  </small>
                </S.InfoCard>
                <S.NewBucketContainer>
                  <h3>{'Add an App Bucket'}</h3>
                  <div style={{ display: 'flex' }} className="large-label">
                    <Input
                      value={newKind}
                      onChange={(e) => {
                        setNewBucket(e.target.value);
                      }}
                      placeholder="Enter new app bucket"
                    />
                    <BaseButton
                      onClick={() => {
                        if (newBucket) {
                          handleNewBucket(newBucket);
                          setNewKind('');
                        }
                      }}
                    >
                      Add bucket
                    </BaseButton>
                  </div>
                  <BaseCheckbox.Group
                    style={{ paddingLeft: '1rem' }}
                    className={`custom-checkbox-group grid-checkbox-group large-label ${
                      storedAppBuckets?.length ? 'dynamic-group' : ''
                    }`}
                    value={settings.dynamicAppBuckets || []}
                    onChange={(checkedValues) => handleSettingsChange('dynamicAppBuckets', checkedValues as string[])}
                  >
                    {(storedAppBuckets || []).map((bucket) => (
                      <div
                        style={{ display: 'flex', flexDirection: 'row', gap: '.5rem', alignItems: 'center' }}
                        key={bucket}
                      >
                        <div className="checkbox-container">
                          <BaseCheckbox value={bucket} />
                          <S.CheckboxLabel
                            isActive={true}
                            style={{ fontSize: '1rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
                          >
                            {bucket}
                          </S.CheckboxLabel>
                        </div>
                        <BaseButton
                          style={{ height: '2rem', width: '5rem', marginRight: '1rem' }}
                          onClick={() => handleRemovedBucket(bucket)}
                        >
                          Remove
                        </BaseButton>
                      </div>
                    ))}
                  </BaseCheckbox.Group>
                </S.NewBucketContainer>
              </div>
            </S.Card>
          </StyledPanel>
        </Collapse>
        <S.SwitchContainer
          style={{
            display: 'grid',
            paddingTop: '2rem',
            gridTemplateColumns: '5rem 6.5rem',
            marginBottom: '1.5rem',
            marginTop: '1rem',
          }}
        >
          <S.LabelSpan>{t('common.serverSetting')}</S.LabelSpan>
          <S.LargeSwitch
            className="modeSwitch"
            checkedChildren="Strict"
            unCheckedChildren="Unlimited"
            checked={settings.mode === 'smart'}
            onChange={(e) => handleModeChange(e)}
          />
        </S.SwitchContainer>
        <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
          <StyledPanel
            header={settings.mode !== 'smart' ? `Blacklisted Kind Numbers` : 'Kind Numbers'}
            key="notes"
            className="centered-header"
          >
            <S.Card>
              <div className="flex-col w-full">
                {settings.mode !== 'unlimited' && settings.mode !== '' && (
                  <div className="switch-container">
                    <BaseSwitch
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      checked={settings.isKindsActive}
                      onChange={() => handleSwitchChange('isKindsActive', !settings.isKindsActive)}
                    />
                  </div>
                )}
                <BaseCheckbox.Group
                  className="large-label"
                  value={settings.mode == 'unlimited' ? blacklist.kinds : settings.kinds}
                  onChange={(checkedValues) => handleSettingsChange('kinds', checkedValues as string[])}
                  disabled={settings.mode !== 'smart' ? false : !settings.isKindsActive}
                >
                  {groupedNoteOptions.map((group) => (
                    <div key={group.id} style={{ paddingBottom: '2rem' }}>
                      <h3 className="checkboxHeader w-full">{group.name}</h3>
                      <div className="custom-checkbox-group grid-checkbox-group large-label">
                        {group.notes.map((note) => (
                          <div className="checkbox-container" style={{ paddingLeft: '.6rem' }} key={note.kindString}>
                            <BaseCheckbox
                              value={note.kindString}
                              className={settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''}
                              disabled={settings.mode !== 'smart' ? false : !settings.isKindsActive}
                            />
                            <S.CheckboxLabel
                              isActive={settings.mode !== 'smart' ? true : settings.isKindsActive}
                              style={{
                                paddingRight: '.8rem',
                                paddingLeft: '.8rem',
                                color:
                                  settings.mode !== 'smart'
                                    ? themeObject[theme].textMain
                                    : relaySettings.isKindsActive
                                    ? themeObject[theme].textMain
                                    : themeObject[theme].textLight,
                              }}
                            >
                              {t(`kind${note.kind}`)} - <span style={{ fontWeight: 'normal' }}>{note.description}</span>
                            </S.CheckboxLabel>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </BaseCheckbox.Group>
              </div>
              {settings.mode === 'unlimited' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <h3>{'Add to Blacklist'}</h3>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <Input value={newKind} onChange={(e) => setNewKind(e.target.value)} placeholder="Enter new kind" />
                    <BaseButton
                      onClick={() => {
                        if (newKind) {
                          handleNewDynamicKind(newKind);
                          setNewKind('');
                        }
                      }}
                    >
                      Add Kind
                    </BaseButton>
                  </div>
                  <BaseCheckbox.Group
                    style={{ paddingLeft: '.6rem' }}
                    className={`custom-checkbox-group grid-checkbox-group large-label ${
                      settings.mode === 'unlimited' ? 'blacklist-mode-active ' : ''
                    }${storedDynamicKinds?.length ? 'dynamic-group' : ''}`}
                    value={settings.dynamicKinds || []}
                    onChange={(checkedValues) => handleSettingsChange('dynamicKinds', checkedValues as string[])}
                  >
                    {(storedDynamicKinds || []).map((kind) => (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '.5rem',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                        key={kind}
                      >
                        <div className="checkbox-container">
                          <BaseCheckbox
                            style={{ paddingLeft: '0rem' }}
                            className={settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''}
                            value={kind}
                          />
                          <S.CheckboxLabel
                            isActive={true}
                            style={{ fontSize: '1.2rem', paddingRight: '.8rem', paddingLeft: '.8rem' }}
                          >
                            {`kind` + kind}
                          </S.CheckboxLabel>
                        </div>
                        <BaseButton style={{ height: '2rem', width: '5rem' }} onClick={() => removeDynamicKind(kind)}>
                          Remove
                        </BaseButton>
                      </div>
                    ))}
                  </BaseCheckbox.Group>
                </div>
              )}
            </S.Card>
          </StyledPanel>
        </Collapse>

        <Collapse style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }} bordered={false}>
          <StyledPanel header={settings.mode !== 'smart' ? `Blacklisted Photo Extensions` : 'Photo Extensions'} key="2">
            <S.Card style={{ flexDirection: 'column' }}>
              {settings.mode !== 'unlimited' && settings.mode !== '' && (
                <div className="switch-container">
                  <BaseSwitch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    checked={settings.isPhotosActive}
                    onChange={() => handleSwitchChange('isPhotosActive', !settings.isPhotosActive)}
                  />
                </div>
              )}

              <BaseCheckbox.Group
                style={{ paddingLeft: '1rem' }}
                className={`custom-checkbox-group grid-mobile-checkbox-group ${
                  settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                }`}
                options={photoFormatOptions}
                value={settings.mode == 'unlimited' ? blacklist.photos : settings.photos}
                onChange={(checkedValues) => handleSettingsChange('photos', checkedValues as string[])}
                disabled={settings.mode !== 'smart' ? false : !settings.isPhotosActive}
              />
            </S.Card>
          </StyledPanel>
        </Collapse>
        <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
          <StyledPanel header={settings.mode !== 'smart' ? `Blacklisted Video Extensions` : 'Video Extensions'} key="3">
            <S.Card style={{ flexDirection: 'column' }}>
              {settings.mode !== 'unlimited' && settings.mode !== '' && (
                <div className="switch-container">
                  <BaseSwitch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    checked={settings.isVideosActive}
                    onChange={() => handleSwitchChange('isVideosActive', !settings.isVideosActive)}
                  />
                </div>
              )}

              <BaseCheckbox.Group
                style={{ paddingLeft: '1rem' }}
                className={`custom-checkbox-group grid-mobile-checkbox-group ${
                  settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                }`}
                options={videoFormatOptions}
                value={settings.mode == 'unlimited' ? blacklist.videos : settings.videos}
                onChange={(checkedValues) => handleSettingsChange('videos', checkedValues as string[])}
                disabled={settings.mode !== 'smart' ? false : !settings.isVideosActive}
              />
            </S.Card>
          </StyledPanel>
        </Collapse>
        {/* <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
          <StyledPanel
            header={
              settings.mode === 'unlimited' ? `Blacklisted ${t('checkboxes.gitNestr')}` : t('checkboxes.gitNestr')
            }
            key="4"
          >
            <S.Card>
              <div>
                <BaseSwitch
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                  checked={settings.isGitNestrActive}
                  onChange={() => handleSwitchChange('isGitNestrActive', !settings.isGitNestrActive)}
                />
              </div>
              <BaseCheckbox.Group
                style={{ paddingLeft: '1rem' }}
                className={`custom-checkbox-group grid-checkbox-group large-label ${
                  settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                }`}
                options={gitNestrHkindOptions}
                value={settings.mode == 'unlimited' ? blacklist.gitNestr : settings.gitNestr}
                onChange={(checkedValues) => handleSettingsChange('gitNestr', checkedValues as string[])}
                disabled={!settings.isGitNestrActive}
              />
            </S.Card>
          </StyledPanel>
        </Collapse> */}
        <Collapse bordered={false} style={{ padding: '1rem 0 1rem 0', margin: '0 0 1rem 0' }}>
          <StyledPanel header={settings.mode !== 'smart' ? `Blacklisted Audio Extensions` : 'Audio Extensions'} key="5">
            <S.Card>
              {settings.mode !== 'unlimited' && settings.mode !== '' && (
                <div className="switch-container">
                  <BaseSwitch
                    checkedChildren="ON"
                    unCheckedChildren="OFF"
                    checked={settings.isAudioActive}
                    onChange={() => handleSwitchChange('isAudioActive', !settings.isAudioActive)}
                  />
                </div>
              )}
              <BaseCheckbox.Group
                style={{ paddingLeft: '1rem' }}
                className={`custom-checkbox-group grid-mobile-checkbox-group ${
                  settings.mode === 'unlimited' ? 'blacklist-mode-active' : ''
                }`}
                options={audioFormatOptions}
                value={settings.mode == 'unlimited' ? blacklist.audio : settings.audio}
                onChange={(checkedValues) => handleSettingsChange('audio', checkedValues as string[])}
                disabled={settings.mode !== 'smart' ? false : !settings.isAudioActive}
              />
            </S.Card>
          </StyledPanel>
        </Collapse>

        <BaseButton style={{ marginTop: '2rem' }} type="primary" loading={loadings[0]} onClick={onSaveClick}>
          {t('buttons.saveSettings')}
        </BaseButton>
      </BaseCol>
    </BaseRow>
  );

  return (
    <>
      <PageTitle>{t('common.customizeRelaySettings')}</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default RelaySettingsPage;
