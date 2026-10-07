import { expect, fn } from 'storybook/test';
import Button from './Button';

export default {
    title: 'Components/Button',
    component: Button,
    args: {
        onClick: fn(),
    },
}

export const Send = {
    args: {
        variant: "primary",
        fullWidth: false,
        children: "Send",
    },
    play: async ({ args, canvas, userEvent }) => {
        const button = canvas.getByRole('button', { name: /Send/i });

        await userEvent.click(button);
        expect(args.onClick).toHaveBeenCalledOnce();
    },
}

export const Neutral = {
    args: {
        variant: "neutral",
        fullWidth: false,
        children: "No, cancel",
    },
    play: async ({ args, canvas, userEvent }) => {
        const button = canvas.getByRole('button', { name: /No, cancel/i });

        await userEvent.click(button);
        expect(args.onClick).toHaveBeenCalledOnce();
    },
}

export const Danger = {
    args: {
        variant: "danger",
        fullWidth: false,
        children: "Yes, Delete",
    },
    play: async ({ args, canvas, userEvent }) => {
        const button = canvas.getByRole('button', { name: /Yes, Delete/i });

        await userEvent.click(button);
        expect(args.onClick).toHaveBeenCalledOnce();
    },
}