<?php

/*
    Symfony Controller for handling contact form submission.
    Note: This code is intended for Symfony framework and may need adjustments for other platforms.
    Please replace the sensitive data (email addresses, etc.) with your own.
*/


namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Throwable;

class FormController extends AbstractController
{
    /**
     * @Route("/offer", name="contact_load", methods={"GET"})
     */
    public function load(): Response
    {
        return $this->render('contact2.html.twig');
    }

    /**
     * @Route("/offer", name="contact_post", methods={"POST"})
     */
    public function index(Request $request): Response
    {
        $name = $request->request->get('clientName');
        $email = $request->request->get('clientEmail');
        $description = $request->request->get('projectDescription');
        $projectDate = $request->request->get('projectDate');
        $budget = $request->request->get('budgetAmount');
        $ipAddress = $request->getClientIp();
        $browserData = $request->getLanguages();

        try {
            // Check if all required fields are filled
            if (!empty($name) && !empty($email) && !empty($description) && !empty($projectDate) && !empty($budget)) {
                // Send email with form data
                $to = 'mail@example.com';
                $subject = 'New Contact Request';
                $message = 'Name: ' . $name . "\r\n\r\n";
                $message .= 'Email: ' . $email . "\r\n\r\n";
                $message .= 'Description: ' . $description . "\r\n\r\n";
                $message .= 'Project Date: ' . $projectDate . "\r\n\r\n";
                $message .= 'Budget: ' . $budget . "\r\n\r\n";
                $headers = 'From: ' . $email . "\r\n" .
                    'Reply-To: ' . $email . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                if (mail($to, $subject, $message, $headers)) {
                    return new JsonResponse(['success' => true, 'message' => 'Successfully submitted.']);
                } else {
                    throw new \Exception('Failed to send email.');
                }
            } else {
                throw new \Exception('Please fill in all required fields.');
            }
        } catch (Throwable $e) {
            // Send error message via email
            $errorMessage = $e->getMessage();
            $subject = 'Error in Contact Request';
            $message = 'Error: ' . $errorMessage . "\r\n\r\n";
            $headers = 'From: ' . $email . "\r\n" .
                'Reply-To: ' . $email . "\r\n" .
                'X-Mailer: PHP/' . phpversion();

            mail($to, $subject, $message, $headers);

            return new JsonResponse(['success' => false, 'message' => $errorMessage], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
