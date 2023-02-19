use std::io::Cursor;

use image::{
    DynamicImage, GenericImage, GenericImageView, ImageBuffer, ImageFormat, ImageOutputFormat,
    Pixel, Rgba,
};
use wasm_bindgen::prelude::*;
extern crate base64;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

fn base64_to_dynamic_image(base64_string: &str) -> DynamicImage {
    let base64 = base64_string.trim_start_matches("data:image/jpeg;base64,");

    let decoded = base64::decode(base64);

    return image::load_from_memory_with_format(&decoded.unwrap(), ImageFormat::Jpeg).unwrap();
}

pub fn dynamic_image_to_base64(image: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    image
        .write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = base64::encode(image_data);
    format!("data:image/jpeg;base64,{}", res_base64)
}

/**
 * This function calculates the size of the kernel based on the sigma value 
 * initializes a new kernel vector with zeros 
 * and then populates the vector with Gaussian weights
 */
fn generate_gaussian_kernel(sigma: f32) -> Vec<Vec<f32>> {
    let size = (6.0 * sigma).ceil() as usize;
    let mut kernel = vec![vec![0.0; size]; size];
    let norm = 2.0 * sigma * sigma;

    for y in 0..size {
        for x in 0..size {
            let x_dist = (x as f32 - size as f32 / 2.0).powi(2);
            let y_dist = (y as f32 - size as f32 / 2.0).powi(2);
            let weight = (-1.0 * (x_dist + y_dist) / norm).exp();

            kernel[y][x] = weight;
        }
    }

    // Normalize the kernel so that its elements sum up to 1
    let sum: f32 = kernel.iter().map(|row| row.iter().sum::<f32>()).sum();
    kernel
        .iter_mut()
        .for_each(|row| row.iter_mut().for_each(|v| *v /= sum));

    kernel
}

/**
 * This function generates a gaussian kernel using the generate_gaussian_kernel function
 * applies the kernel to each pixel in the input image
 * for each pixel function calculates weighted sum of neighboring pixels using the kernel 
 * rounds the sum to the nearest integer
 * and then writes result to the output 
 */
#[wasm_bindgen]
pub fn apply_basic_gaussian(base64_img: String) -> String {
    let img = base64_to_dynamic_image(&base64_img);
    let sigma: f32 = 5.0;
    let kernel = generate_gaussian_kernel(sigma);
    let kernel_size = kernel.len();

    // Create an output image buffer with the same dimensions as the input image
    let (width, height) = img.dimensions();
    let mut output_buffer = ImageBuffer::new(width, height);

    // Apply the filter to each pixel in the input image
    for y in 0..height {
        for x in 0..width {
            let mut sum_red = 0.0;
            let mut sum_green = 0.0;
            let mut sum_blue = 0.0;
            let mut sum_alpha = 0.0;

            for j in 0..kernel_size {
                for i in 0..kernel_size {
                    let pixel_x = (x + i as u32) as i32 - (kernel_size / 2) as i32;
                    let pixel_y = (y + j as u32) as i32 - (kernel_size / 2) as i32;

                    if pixel_x < 0
                        || pixel_x >= width as i32
                        || pixel_y < 0
                        || pixel_y >= height as i32
                    {
                        // Skip pixels outside the image bounds
                        continue;
                    }

                    let pixel = img.get_pixel(pixel_x as u32, pixel_y as u32);
                    let kernel_value = kernel[j][i];

                    sum_red += kernel_value * pixel[0] as f32;
                    sum_green += kernel_value * pixel[1] as f32;
                    sum_blue += kernel_value * pixel[2] as f32;
                    sum_alpha += kernel_value * pixel[3] as f32;
                }
            }

            let pixel = Rgba([
                sum_red.round() as u8,
                sum_green.round() as u8,
                sum_blue.round() as u8,
                sum_alpha.round() as u8,
            ]);

            output_buffer.put_pixel(x, y, pixel);
        }
    }

    let d_image = DynamicImage::ImageRgba8(output_buffer);
    return dynamic_image_to_base64(&d_image);
}

/**
 * This function applies the inversion operation to each pixel in the input image 
 */
#[wasm_bindgen]
pub fn apply_invert(base64_img: String) -> String {
    let img = base64_to_dynamic_image(&base64_img);

    let (width, height) = img.dimensions();
    let mut output = DynamicImage::new_rgb8(width, height);

    // Invert the colors of each pixel in the image
    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let inverted_pixel = pixel.map(|c| 255 - c);
            output.put_pixel(x, y, inverted_pixel);
        }
    }

    return dynamic_image_to_base64(&output);
}

/**
 * This function applies the flip operation to each pixel in the input image
 */
#[wasm_bindgen]
pub fn apply_flip(base64_img: String) -> String {
    let img = base64_to_dynamic_image(&base64_img);

    // Get the dimensions of the image
    let (width, height) = img.dimensions();

    // Create a new DynamicImage to hold the flipped image
    let mut flipped = DynamicImage::new_rgb8(width, height);

    // Flip the image horizontally
    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let flipped_x = width - x - 1;
            flipped.put_pixel(flipped_x, y, pixel);
        }
    }

    return dynamic_image_to_base64(&flipped);
}


