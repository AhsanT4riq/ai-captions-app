import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-media-library';
import { useEffect, useState } from 'react';

export const useMediaPermissions = () => {
  const [granted, setGranted] = useState(false);
  const [status, setStatus] = useState<PermissionStatus>(PermissionStatus.UNDETERMINED);
  const [error, setError] = useState<string | null>(null);

  //   get permission status
  useEffect(() => {
    (async () => {
      try {
        const permission = await MediaLibrary.getPermissionsAsync();
        setStatus(permission.status);
        setGranted(permission.granted);
      } catch (e) {
        setError(e as string);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const permission = await MediaLibrary.requestPermissionsAsync();
        setStatus(permission.status);
        setGranted(permission.granted);
      } catch (e) {
        setError(e as string);
      }
    })();
  }, []);

  return { granted, error, status };
};
