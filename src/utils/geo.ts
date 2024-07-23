export const geo = {
  getLocation(): Promise<Partial<GeolocationCoordinates>> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (err) => {
            console.log(`getPosError:${err.code},${navigator.geolocation},${err.message}`);
          }
        );
      } else {
        console.log('This browser does not support getting geolocation');
      }
    });
  },
  openMap({ latitude, longitude }: Record<string, string | number>) {
    if (latitude && longitude) {
      const label = 'Custom Label'; // 自定义标签
      const url = `https://maps.google.com/maps?q=${latitude},${longitude}&label=${label}`;
      window.open(url, '_blank');
    }
  },
};
