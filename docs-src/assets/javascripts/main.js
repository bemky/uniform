import * as Uniform from 'uniform';
window.Uniform = Uniform;

// Hack for Floating UI
window.process = {
    env: {
        NODE_ENV: 'development'
    }
}