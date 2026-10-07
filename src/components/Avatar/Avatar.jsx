import { getAssetUrl } from "@/utils/getAssetUrl";

function Avatar({ user, alt ="", className = "" }) {
    const {image, username} = user;

    return (
        <picture>
            <source srcSet={getAssetUrl(image.webp)} type="image/webp" />
            <img 
                src={getAssetUrl(image.png)}
                alt={alt}
                width={32}
                height={32}
                loading="lazy"
                className={`size-8 rounded-full ${className}`}
                data-username={username}
            />
        </picture>

    );
}

export default Avatar;