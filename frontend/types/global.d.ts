type onboardingSwiperDataType = {
  id: number;
  title?: string;
  description?: string;
  sortDescription?: string;
  sortDescription2?: string;
  image?: any;
}


type User = {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  avatar?: string;
  courses: any;
  createdAt: Date;
  updatedAt: Date;
}

type BannerDataTypes = {
  bannerImageUrl: any;
}

